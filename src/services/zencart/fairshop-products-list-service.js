import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { getColumnValue } from '../../fairshop-commons';
import '@polymer/iron-ajax/iron-ajax.js';


/**
 * @class
 */
export class FairshopProductsListService extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			selectedManufacturer: {
				type: Number,
				observer: '_manufacturerChanged'
			},
			selectedCategory: {
				type: Number,
				observer: '_categoryChanged'
			},
			searchString: {
				type: String,
				observer: '_searchStringChanged'
			},
			page: {
				type: Number,
				value: 1,
				observer: '_pageChanged',
				notify: true
			},
			itemsPerPage: {
				type: Number,
				value: 42
			},
			_imageUrlMap: {
				type: Map
			},
			sortOrder: {
				type: String,
				value: 'sum,desc',
				observer: '_orderChanged'
			},
			_productListTmp: {
				type: Object
			},
			productList: {
				type: Object,
				notify: true
			}
		};
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html`
			<iron-ajax
				id="requestProducts"
				handle-as="json"
				on-response="_productsReceived">
			</iron-ajax>
		`;
	}

	_pageChanged(newValue, oldValue) {
		if (oldValue) {
			this._requestProducts();
		}
	}

	_requestProducts() {
		this.$.requestProducts.url = this.restUrl + 'products_view?columns=id,price,manufacturers_name,name,description,products_image&order[]=' + this.sortOrder + '&order[]=pos&page=' + this.page + ',' + this.itemsPerPage + '';
		if (this.searchString) {
			this.$.requestProducts.url += '&filter[]=nr,cs,' + this.searchString + '&filter[]=EAN,cs,' + this.searchString + '&filter[]=manufacturers_name,cs,' + this.searchString + '&filter[]=name,cs,' + this.searchString + '&filter[]=description,cs,' + this.searchString + '&satisfy=any';
		}
		else if (this.selectedManufacturer) {
			// TODO: get countries iso code from session
			this.$.requestProducts.url += '&filter[]=manufacturers_id,eq,' + this.selectedManufacturer + '&filter[]=countries_iso_code_2,eq,DE&filter[]=language,eq,de';
		}
		else if (this.selectedCategory) {
			// TODO: get countries iso code from session
			this.$.requestProducts.url = this.restUrl + 'products_to_categories_view?columns=categories_name,id,price,manufacturers_name,name,description,products_image&order[]=' + this.sortOrder + '&order[]=pos&page=' + this.page + ',' + this.itemsPerPage + '';
			this.$.requestProducts.url += '&filter[]=categories_id,eq,' + this.selectedCategory + '&filter[]=countries_iso_code_2,eq,DE&filter[]=language,eq,de';
		}
		else {
			// All
			this.$.requestProducts.url += '&filter[]=countries_iso_code_2,eq,DE';
		}
		this.$.requestProducts.generateRequest();
	}

	_orderChanged(newValue, oldValue) {
		if (oldValue) {
			// Redo rest call
			this._requestProducts();
		}
	}

	_manufacturerChanged() {
		if (this.selectedManufacturer) {
			this.selectedCategory = null;
			this.searchString = null;
			if (this.page != 1) {
				// Triggers request
				this.page = 1;
			}
			else {
				this._requestProducts();
			}
		}
	}

	_categoryChanged() {
		if (this.selectedCategory) {
			this.selectedManufacturer = null;
			this.searchString = null;
			if (this.page != 1) {
				// Triggers request
				this.page = 1;
			}
			else {
				this._requestProducts();
			}
		}
	}

	_searchStringChanged() {
		if (this.searchString) {
			console.log('Searching products: ' + this.searchString);
			this.selectedManufacturer = null;
			this.selectedCategory = null;
		}
		else {
			this.selectedManufacturer = null;
			this.selectedCategory = null;
			// All filters null
		}
		if (this.page != 1) {
			// Triggers request
			this.page = 1;
		}
		else {
			this._requestProducts();
		}
}

	/**
	 * Pagewise
	 */
	_productsReceived(data) {
		var columns = null;
		var records = null;
		var results = 0;
		var title = 'Keine Produkte gefunden';
		var prodIdSet = new Set();
		if (data.detail.response && data.detail.response.products_view && data.detail.response.products_view.results && data.detail.response.products_view.records) {
			columns = data.detail.response.products_view.columns;
			records = data.detail.response.products_view.records;
			results = data.detail.response.products_view.results;
			if (this.selectedManufacturer) {
				title = 'Produkte von ' + getColumnValue(columns, 'manufacturers_name', records[0]);
			}
			else if (this.searchString) {
				title = 'Suchergebis für "' + this.searchString + '"';
			}
			else {
				title = 'Alle Produkte';
			}
		}
		else if (data.detail.response && data.detail.response.products_to_categories_view && data.detail.response.products_to_categories_view.results && data.detail.response.products_to_categories_view.records) {
			columns = data.detail.response.products_to_categories_view.columns;
			records = data.detail.response.products_to_categories_view.records;
			results = data.detail.response.products_to_categories_view.results;
			title = 'Produkte der Kategorie ' + getColumnValue(columns, 'categories_name', records[0]);
		}
		this._productListTmp = {
			'title': title,
			'products': new Array(),
			'productCnt': results
		};
		if (records) {
			for (let item of records) {
				var prodId = getColumnValue(columns, 'id', item);
				if (prodIdSet.has(prodId)) {
					continue;
				}
				prodIdSet.add(prodId);
				var product = {
					'id': prodId,
					'price': Number(getColumnValue(columns, 'price', item)).toFixed(2),
					'manufacturerName': getColumnValue(columns, 'manufacturers_name', item),
					'name': getColumnValue(columns, 'name', item),
					'description': getColumnValue(columns, 'description', item),
					'imageUrl': this.imageUrl + getColumnValue(columns, 'products_image', item)
				};
				this._productListTmp.products.push(product);
			}
		}
		this.productList = this._productListTmp;
		this.dispatchEvent(new CustomEvent('test-event', { detail: 'ajax-loaded' }));
	}

}
customElements.define("fairshop-products-list-service", FairshopProductsListService);
