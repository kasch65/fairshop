import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './fairshop-paginator.js';
import './fairshop-product-card.js';

/**
 * @class
 */
export class FairshopProductsList extends PolymerElement {
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
			hrefPrefix: {
				tape: String
			},
			_productCnt: {
				type: Number
			},
			page: {
				type: Number,
				value: 1,
				observer: '_pageChanged',
				notify: true
			},
			_itemsPerPage: {
				type: Number,
				value: 48
			},
			_imageUrlMap: {
				type: Map
			},
			_title: {
				type: String,
				value: 'Artikelliste'
			},
			_sortOrder: {
				type: String,
				value: 'sum,desc',
				observer: '_orderChanged'
			}
		};
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html `
			<style>
				:host {
					@apply --faishop-host;
				}
				h1,
				h2,
				h3 {
					@apply --faishop-header;
				}
				#backBtn {
					right: 0;
					position: absolute;
					top: 4rem;
				}
				.products {
					overflow: hidden;
				}
				.active {
					background-color: var(--google-blue-100);
				}
				.products>list {
					overflow: auto;
				}
				ul {
					list-style-type: none;
				}
				li {
					float: left;
				}
				li>a {
					text-decoration: none;
				}
				.sorting {
					float: left;
					margin-right: 1rem;
					margin-bottom: 1rem;
				}
				.label {
					position: relative;
					padding: 0.5rem;
					float: left;
				}
				select {
					height: 2.5rem;
					font-size: 1rem;

					padding: 0.5rem;
					border-style: none none solid none;
					border-width: 0 0 2px 0;
					border-radius: .2rem .2rem 0 0;
					border-color: #8884;
					background-color: #eee;
					color: var(--primary-text-color);
				}
				fairshop-paginator {
					display: inline-block;
				}
			</style>
			<div class="products">
				<paper-icon-button id="backBtn" icon="arrow-back" aria-label="Go back" on-click="_goBack"></paper-icon-button>
				<div class="heading"><h1>[[_title]]</h1></div>
				<template is="dom-if" if="[[searchString]]">
					<div class="filtered">Filter: <b>[[searchString]]</b></div>
				</template>
				<template is="dom-if" if="[[_productCnt]]">
					<div class="sorting">
						<div class="label">Sortierung:</div>
						<select value="{{_sortOrder::change}}">
							<option value="sum,desc">Relevanz</option>
							<option value="price">Preis aufsteigend</option>
							<option value="price,desc">Preis absteigend</option>
							<option value="name">Name</option>
							<option value="available,desc">Verfügbarkeit</option>
						</select> 
					</div>
					<fairshop-paginator page="{{page}}" product-cnt="[[_productCnt]]" items-per-page="{{_itemsPerPage}}"></fairshop-paginator>
				</template>
				<div class="list">
					<ul id="productsList">
					</ul>
				</div>
			</div>

			<iron-ajax 
				id="requestManufacturerProducts"
				url="[[restUrl]]product_search_copy?filter[]=manufacturerId,eq,[[selectedManufacturer]]&filter[]=language,eq,43&columns=id,price,manufacturerName,name,description&order[]=[[_sortOrder]]&order[]=pos&page=[[page]],[[_itemsPerPage]]"
				handle-as="json"
				on-response="_manufacturerProductsReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestCategoryProducts"
				url="[[restUrl]]product_category_view?filter[]=categoryId,eq,[[selectedCategory]]&filter[]=language,eq,43&columns=id,price,manufacturerName,name,description,categoryName&order[]=[[_sortOrder]]&order[]=pos&page=[[page]],[[_itemsPerPage]]"
				handle-as="json"
				on-response="_categoryProductsReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductImages"
				handle-as="json"
				on-response="_productImagesReceived">
			</iron-ajax>

			<iron-ajax 
				id="searchProductDescriptions"
				handle-as="json"
				on-response="_searchProductDescriptionsReceived">
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
			this.$.searchProductDescriptions.url = this.restUrl + 'product_search_copy?filter[]=nr,cs,' + this.searchString + '&filter[]=ean,cs,' + this.searchString + '&filter[]=manufacturerName,cs,' + this.searchString + '&filter[]=name,cs,' + this.searchString + '&filter[]=description,cs,' + this.searchString + '&filter[]=description2,cs,' + this.searchString + '&satisfy=any&columns=id,price,manufacturerName,name,description&order[]=' + this._sortOrder + '&order[]=pos&page=' + this.page + ',' + this._itemsPerPage;
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
		if ( data.detail.response && data.detail.response.product_search_copy && data.detail.response.product_search_copy.records) {
			this._title = 'Produkte von ' + data.detail.response.product_search_copy.records[0][2];
			this._products = data.detail.response.product_search_copy.records;
			this._productCnt = data.detail.response.product_search_copy.results;

			var itemIdList = '';
			for (let item of data.detail.response.product_search_copy.records) {
				itemIdList += ',';
				itemIdList += item[0];
			}

			var productImagesRequestor = this.$.requestProductImages;
			productImagesRequestor.url = this.restUrl + 'product_images?filter=productId,in' + itemIdList + '&columns=productId,small';
			productImagesRequestor.generateRequest();
		}
	}

	_categoryProductsReceived(data) {
		if (data.detail.response && data.detail.response.product_category_view && data.detail.response.product_category_view.records && data.detail.response.product_category_view.records.length) {
			this._title = data.detail.response.product_category_view.records[0][5];
			this._products = data.detail.response.product_category_view.records;
			this._productCnt = data.detail.response.product_category_view.results;

			var itemIdList = '';
			for (let item of data.detail.response.product_category_view.records) {
				itemIdList += ',';
				itemIdList += item[0];
			}

			var productImagesRequestor = this.$.requestProductImages;
			productImagesRequestor.url = this.restUrl + 'product_images?filter=productId,in' + itemIdList + '&columns=productId,small';
			productImagesRequestor.generateRequest();
		}
		else {
			this._title = 'Keine Produkte gefunden';
			this._products = null;
			this._productCnt = 0;
			// Clear old items
			var target = this.$.productsList;
			while (target.firstChild) {
				target.removeChild(target.firstChild);
			}
		}
	}

	_searchProductDescriptionsReceived(data) {
		if ( data.detail.response && data.detail.response.product_search_copy && data.detail.response.product_search_copy.records) {
			this._title = 'Suchergebnis';
			this._products = data.detail.response.product_search_copy.records;
			this._productCnt = data.detail.response.product_search_copy.results;

			var itemIdList = '';
			for (let item of data.detail.response.product_search_copy.records) {
				itemIdList += ',';
				itemIdList += item[0];
			}

			var productImagesRequestor = this.$.requestProductImages;
			productImagesRequestor.url = this.restUrl + 'product_images?filter=productId,in' + itemIdList + '&columns=productId,small';
			productImagesRequestor.generateRequest();
		}
		else {
			this._title = 'Keine Produkte gefunden';
			this._products = null;
			this._productCnt = 0;
			// Clear old items
			var target = this.$.productsList;
			while (target.firstChild) {
				target.removeChild(target.firstChild);
			}
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
		// Clear old items
		var target = this.$.productsList;
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}
		// Add new items
		for (let productInfo of this._products) {
			var imageUrl = this._imageUrlMap.get(productInfo[0]);
			var liElement = document.createElement('li');
			var aElement = document.createElement('a');
			aElement.setAttribute('href', this.hrefPrefix + '/' + productInfo[0]);
			var productCard = document.createElement('fairshop-product-card');
			if (imageUrl) {
				productCard.imageUrl = this.imageUrl + imageUrl;
			}
			productCard.name = productInfo[3];
			productCard.description = productInfo[4];
			productCard.price = productInfo[1];
			productCard.manufacturerName = productInfo[2];
			aElement.appendChild(productCard);
			liElement.appendChild(aElement);
			target.appendChild(liElement);
		}
		// Let tests wait until ajax data has been evaluated and this event to be fired
		this.dispatchEvent(new CustomEvent('test-event', {detail: 'ajax-loaded'}));
	}

	_goBack() {
		window.history.back();
	}

}
customElements.define("fairshop-products-list", FairshopProductsList);
