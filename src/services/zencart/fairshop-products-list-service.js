import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
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
			<iron-ajax id="requestManufacturerProducts" url="[[restUrl]]product_search_copy?filter[]=manufacturerId,eq,[[selectedManufacturer]]&filter[]=language,eq,43&columns=id,price,manufacturerName,name,description&order[]=[[sortOrder]]&order[]=pos&page=[[page]],[[itemsPerPage]]"
				handle-as="json" on-response="_manufacturerProductsReceived">
			</iron-ajax>
			
			<iron-ajax id="requestCategoryProducts" url="[[restUrl]]product_category_view?filter[]=categoryId,eq,[[selectedCategory]]&filter[]=language,eq,43&columns=id,price,manufacturerName,name,description,categoryName&order[]=[[sortOrder]]&order[]=pos&page=[[page]],[[itemsPerPage]]"
				handle-as="json" on-response="_categoryProductsReceived">
			</iron-ajax>
			
			<iron-ajax id="requestProductImages" handle-as="json" on-response="_productImagesReceived">
			</iron-ajax>
			
			<iron-ajax id="searchProductDescriptions" handle-as="json" on-response="_searchProductDescriptionsReceived">
			</iron-ajax>
		`;
	}

	_pageChanged(newValue, oldValue) {
		if (oldValue) {
			if (this.searchString) {
				this._searchStringChanged();
			}
			else if (this.selectedManufacturer) {
				this.$.requestManufacturerProducts.generateRequest();
			}
			else if (this.selectedCategory) {
				this.$.requestCategoryProducts.generateRequest();
			}
		}
	}

	_orderChanged(newValue, oldValue) {
		if (oldValue) {
			if (this.selectedManufacturer) {
				this.$.requestManufacturerProducts.generateRequest();
			}
			else if (this.selectedCategory) {
				this.$.requestCategoryProducts.generateRequest();
			}
		}
	}

	_manufacturerChanged() {
		if (this.selectedManufacturer) {
			this.selectedCategory = null;
			this.$.requestManufacturerProducts.generateRequest();
			this.page = 1;
		}
	}

	_categoryChanged() {
		if (this.selectedCategory) {
			this.selectedManufacturer = null;
			this.$.requestCategoryProducts.generateRequest();
			this.page = 1;
		}
	}

	_searchStringChanged() {
		if (this.searchString) {
			console.log('Searching products: ' + this.searchString);
			this.$.searchProductDescriptions.url = this.restUrl + 'product_search_copy?filter[]=nr,cs,' + this.searchString + '&filter[]=ean,cs,' + this.searchString + '&filter[]=manufacturerName,cs,' + this.searchString + '&filter[]=name,cs,' + this.searchString + '&filter[]=description,cs,' + this.searchString + '&filter[]=description2,cs,' + this.searchString + '&satisfy=any&columns=id,price,manufacturerName,name,description&order[]=' + this.sortOrder + '&order[]=pos&page=' + this.page + ',' + this.itemsPerPage;
			this.$.searchProductDescriptions.generateRequest();
		}
		else {
			// Fallback to previous search
			if (this.selectedManufacturer) {
				this.selectedCategory = null;
				this.$.requestManufacturerProducts.generateRequest();
				this.page = 1;
			}
			else if (this.selectedCategory) {
				this.selectedManufacturer = null;
				this.$.requestCategoryProducts.generateRequest();
				this.page = 1;
			}
		}
	}

	/**
	 * Pagewise
	 */
	_manufacturerProductsReceived(data) {
		if (data.detail.response && data.detail.response.product_search_copy && data.detail.response.product_search_copy.records) {
			this._productListTmp = {
				'title': 'Produkte von ' + data.detail.response.product_search_copy.records[0][2],
				'products': new Array(),
				'productCnt': data.detail.response.product_search_copy.results
			};

			var itemIdList = '';
			for (let item of data.detail.response.product_search_copy.records) {
				var product = {
					'id': item[0],
					'price': item[1],
					'manufacturerName': item[2],
					'name': item[3],
					'description': item[4],
					'imageUrl': null
				};
				this._productListTmp.products.push(product);

				itemIdList += ',';
				itemIdList += item[0];
			}

			var productImagesRequestor = this.$.requestProductImages;
			productImagesRequestor.url = this.restUrl + 'product_images?filter=productId,in' + itemIdList + '&columns=productId,small';
			productImagesRequestor.generateRequest();
		}
		else {
			this._productListTmp = {
				'title': 'Keine Produkte gefunden',
				'products': null,
				'productCnt': 0
			};
			this.productList = this._productListTmp;
		}
	}

	_categoryProductsReceived(data) {
		if (data.detail.response && data.detail.response.product_category_view && data.detail.response.product_category_view.records && data.detail.response.product_category_view.records.length) {
			this._productListTmp = {
				'title': data.detail.response.product_category_view.records[0][5],
				'products': new Array(),
				'productCnt': data.detail.response.product_category_view.results
			};

			var itemIdList = '';
			for (let item of data.detail.response.product_category_view.records) {
				var product = {
					'id': item[0],
					'price': item[1],
					'manufacturerName': item[2],
					'name': item[3],
					'description': item[4],
					'imageUrl': null
				};
				this._productListTmp.products.push(product);

				itemIdList += ',';
				itemIdList += item[0];
			}

			var productImagesRequestor = this.$.requestProductImages;
			productImagesRequestor.url = this.restUrl + 'product_images?filter=productId,in' + itemIdList + '&columns=productId,small';
			productImagesRequestor.generateRequest();
		}
		else {
			this._productListTmp = {
				'title': 'Keine Produkte gefunden',
				'products': null,
				'productCnt': 0
			};
			this.productList = this._productListTmp;
		}
	}

	_searchProductDescriptionsReceived(data) {
		if (data.detail.response && data.detail.response.product_search_copy && data.detail.response.product_search_copy.records) {
			this._productListTmp = {
				'title': 'Suchergebnis',
				'products': new Array(),
				'productCnt': data.detail.response.product_search_copy.results
			};

			var itemIdList = '';
			for (let item of data.detail.response.product_search_copy.records) {
				var product = {
					'id': item[0],
					'price': item[1],
					'manufacturerName': item[2],
					'name': item[3],
					'description': item[4],
					'imageUrl': null
				};
				this._productListTmp.products.push(product);

				itemIdList += ',';
				itemIdList += item[0];
			}

			var productImagesRequestor = this.$.requestProductImages;
			productImagesRequestor.url = this.restUrl + 'product_images?filter=productId,in' + itemIdList + '&columns=productId,small';
			productImagesRequestor.generateRequest();
		}
		else {
			this._productListTmp = {
				'title': 'Keine Produkte gefunden',
				'products': null,
				'productCnt': 0
			};
			this.productList = this._productListTmp;
		}
	}

	_productImagesReceived(data) {
		var imageUrlMap = new Map();
		if (data.detail.response && data.detail.response.product_images && data.detail.response.product_images.records) {
			for (let productImage of data.detail.response.product_images.records) {
				// Only save first image
				var firstImage = imageUrlMap.get(productImage[0]);
				if (!firstImage) {
					imageUrlMap.set(productImage[0], productImage[1]);
				}
			}
		}
		this._imageUrlMap = imageUrlMap;
		this._processData();
	}

	_processData() {
		// Add image
		for (let productInfo of this._productListTmp.products) {
			var imageUrl = this._imageUrlMap.get(productInfo.id);
			if (imageUrl) {
				productInfo.imageUrl = this.imageUrl + imageUrl;
			}
		}
		this.productList = this._productListTmp;
		// Let tests wait until ajax data has been evaluated and this event to be fired
		this.dispatchEvent(new CustomEvent('test-event', { detail: 'ajax-loaded' }));
	}

}
customElements.define("fairshop-products-list-service", FairshopProductsListService);
