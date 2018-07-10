import { PolymerElement, html } from "@polymer/polymer/polymer-element";
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
			selectedManufacturer: {
				type: Number,
				observer: "_manufacturerChanged"
			},
			selectedCategory: {
				type: Number,
				observer: "_categoryChanged"
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
				#backBtn {
					right: 0;
					position: absolute;
					top: 4rem;
				}
				.products {
					overflow: auto;
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
					height: 2.2rem;
					border-style: solid;
					border-width: 0.5px;
					border-color: var(--google-grey-300);
					font-size: 1rem;
				}
				fairshop-paginator {
					display: inline-block;
				}
			</style>
			<div class="products">
				<paper-icon-button id="backBtn" icon="arrow-back" aria-label="Go back" on-click="_goBack"></paper-icon-button>
				<div class="heading"><h1>[[_title]]</h1></div>
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
		`;
	}

	_pageChanged(newValue, oldValue) {
		if (oldValue) {
			if (this.selectedManufacturer) {
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

	/**
	 * Pagewise
	 */
	_manufacturerProductsReceived(data) {
		if ( data.detail.response.product_search_copy.records) {
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
		if (data.detail.response.product_category_view.records.length) {
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

	_productImagesReceived(data) {
		var imageUrlMap = new Map();
		for (let productImage of data.detail.response.product_images.records) {
			// Only save first image
			var firstImage = imageUrlMap.get(productImage[0]);
			if (!firstImage) {
				imageUrlMap.set(productImage[0], productImage[1]);
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
				productCard.imageUrl = 'http://bukhtest.alphaplanweb.de/' + imageUrl;
			}
			productCard.name = productInfo[3];
			productCard.description = productInfo[4];
			productCard.price = productInfo[1];
			productCard.manufacturerName = productInfo[2];
			aElement.appendChild(productCard);
			liElement.appendChild(aElement);
			target.appendChild(liElement);
		}
	}

	_goBack() {
		window.history.back();
	}

}
customElements.define("fairshop-products-list", FairshopProductsList);
