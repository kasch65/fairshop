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
				value: 50
			},
			_productIds: {
				type: Array,
				notify: true
			},
			_activeProduct: {
				type: Object
			},
			_itemIdList: {
				type: String,
				observer: "_itemIdListChanged"
			},
			_openRequests: {
				type: Number,
				value: 0
			},
			_productInfos: {
				type: Array
			},
			_productDescriptionMap: {
				type: Map
			},
			_imageUrlMap: {
				type: Map
			},
			_title: {
				type: String,
				value: 'Artikelliste'
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
				fairshop-paginator {
					display: inline-block;
				}
			</style>
			<div class="products">
				<paper-icon-button id="backBtn" icon="arrow-back" aria-label="Go back" on-click="_goBack"></paper-icon-button>
				<h1>[[_title]]</h1>
				<fairshop-paginator page="{{page}}" product-cnt="[[_productCnt]]" items-per-page="{{_itemsPerPage}}"></fairshop-paginator>
				<div class="list">
					<ul id="productsList">
					</ul>
				</div>
			</div>

			<iron-ajax 
				id="requestManufacturerProducts"
				url="[[restUrl]]products_manufacturers?filter=manufacturerId,eq,[[selectedManufacturer]]&columns=productId"
				handle-as="json"
				on-response="_manufacturerProductsReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestManufacturerProducts2"
				url="[[restUrl]]product_search_copy?filter[]=manufacturerId,eq,[[selectedManufacturer]]&filter[]=language,eq,43&columns=id,price,manufacturerName,name,description&order[]=sum,desc&order[]=pos&page=[[page]],[[_itemsPerPage]]"
				handle-as="json"
				on-response="_manufacturerProductsReceived2">
			</iron-ajax>

			<iron-ajax 
				id="requestCategoryDescription"
				url="[[restUrl]]category_descriptions?filter=categoryId,eq,[[selectedCategory]]&columns=name"
				handle-as="json"
				on-response="_categoryDescriptionReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestManufacturerDescription"
				url="[[restUrl]]manufacturer_descriptions?filter=manufacturerId,eq,[[selectedManufacturer]]&columns=name"
				handle-as="json"
				on-response="_manufacturerDescriptionReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestCategoryProducts"
				url="[[restUrl]]products_categories?filter=categoryId,eq,[[selectedCategory]]&columns=productId"
				handle-as="json"
				on-response="_categoryProductsReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProducInfo"
				handle-as="json"
				on-response="_productInfoReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductImages"
				handle-as="json"
				on-response="_productImagesReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductDescriptions"
				handle-as="json"
				on-response="_productDescriptionsReceived">
			</iron-ajax>
		`;
	}

	_pageChanged(newValue, oldValue) {
		if (oldValue && this.selectedManufacturer) {
			this.$.requestManufacturerProducts2.generateRequest();
		}
	}

	_manufacturerChanged() {
		if (this.selectedManufacturer) {
			this.$.requestManufacturerProducts2.generateRequest();
			this.page = 1;
		}
	}

	/**
	 * Pagewise
	 */
	_manufacturerProductsReceived2(data) {
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

	_categoryChanged() {
		if (this.selectedCategory) {
			this.$.requestCategoryProducts.generateRequest();
			this.$.requestCategoryDescription.generateRequest();
		}
	}

	_categoryDescriptionReceived(data) {
		this._title = data.detail.response.category_descriptions.records[0][0];
	}

	_manufacturerProductsReceived(data) {
		var productIds = Array();
		for (let row of data.detail.response.products_manufacturers.records) {
			productIds.push(row[0]);
		}
		this._productIds = productIds;
	}

	_categoryProductsReceived(data) {
		var productIds = Array();
		for (let row of data.detail.response.products_categories.records) {
			productIds.push(row[0]);
		}
		this._productIds = productIds;
	}

	_itemIdListChanged() {
		if (this._openRequests != 0) {
			console.log('Product listing ByteLengthQueuingStrategy.toString.toString.!');
			return;
		}
		var productInfoRequestor = this.$.requestProducInfo;
		productInfoRequestor.url =this.restUrl + 'products?filter=id,in,' + this._itemIdList + '&columns=id,price,manufacturerName';
		productInfoRequestor.generateRequest();

		var productDescriptionsRequestor = this.$.requestProductDescriptions;
		productDescriptionsRequestor.url = this.restUrl + 'product_descriptions?filter=id,in,' + this._itemIdList + '&columns=id,name,description';
		productDescriptionsRequestor.generateRequest();

		var productImagesRequestor = this.$.requestProductImages;
		productImagesRequestor.url = this.restUrl + 'product_images?filter=productId,in,' + this._itemIdList + '&columns=productId,small';
		productImagesRequestor.generateRequest();

		this._openRequests = 3;

	}

	_productInfoReceived(data) {
		var productInfos = Array();
		for (let productIinfo of data.detail.response.products.records) {
			productInfos.push(productIinfo);
		}
		this._productInfos = productInfos;
		this._openRequests--;
		if (this._openRequests == 0) {
			this._processData();
		}
	}

	_productDescriptionsReceived(data) {
		var productDescriptionMap = new Map();
		for (let productIinfo of data.detail.response.product_descriptions.records) {
			productDescriptionMap.set(productIinfo[0], productIinfo);
		}
		this._productDescriptionMap = productDescriptionMap;
		this._openRequests--;
		if (this._openRequests == 0) {
			this._processData();
		}
	}

	_goBack() {
		window.history.back();
	}

}
customElements.define("fairshop-products-list", FairshopProductsList);
