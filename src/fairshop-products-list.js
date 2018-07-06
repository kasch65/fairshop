import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import '@polymer/app-route/app-route.js';
import '@polymer/iron-ajax/iron-ajax.js';
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
			selectedProduct: {
				type: Number,
				notify: true
			},
			selectedManufacturer: {
				type: Object,
				observer: "_manufacturerChanged"
			},
			selectedCategory: {
				type: Object,
				observer: "_categoryChanged"
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
			_imageUrlMap: {
				type: Map
			},
			route: {
				Object
			},
			routeData: {
				type: Object
			},
			subRoute: {
				type: Object
			},
			_hrefPrefix: {
				tape: String
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
			<app-route route="{{route}}" pattern="/:groupId" data="{{routeData}}" tail="{{subRoute}}"></app-route>
			<div class="products">
				<h1>Artikelliste</h1>
				<fairshop-paginator product-ids="[[_productIds]]" item-id-list="{{_itemIdList}}"></fairshop-paginator>
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
				id="requestCategoryProducts"
				url="[[restUrl]]products_categories?filter=categoryId,eq,[[selectedCategory]]&columns=productId"
				handle-as="json"
				on-response="_categoryProductsReceived">
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

	static get observers() {
		return ['_routePageChanged(routeData.groupId)'];
	}

	_routePageChanged(page) {
		if (this.route) {
			console.log('fairshop-products-list.route.path: ' + this.route.path);
			if (this.routeData.groupId) {
				console.log('fairshop-products-list.routeData.groupId: ' + this.routeData.groupId);
				if (this.route.prefix.endsWith('/categories')) {
					this.selectedCategory = this.routeData.groupId;
				}
				else if (this.route.prefix.endsWith('/manufacturers')) {
					this.selectedManufacturer = this.routeData.groupId;
				}
			}
			this._hrefPrefix = this.route.prefix + this.route.path;
		}
	}

	_categoryChanged() {
		this.$.requestCategoryProducts.generateRequest();
	}

	_manufacturerChanged() {
		this.$.requestManufacturerProducts.generateRequest();
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
		var productImagesRequestor = this.$.requestProductImages;
		productImagesRequestor.url = this.restUrl + 'product_images?filter=productId,in,' + this._itemIdList + '&columns=productId,small';
		productImagesRequestor.generateRequest();

	}

	_productImagesReceived(data) {
		var productDescriptionsRequestor = this.$.requestProductDescriptions;
		productDescriptionsRequestor.url = this.restUrl + 'product_descriptions?filter=id,in,' + this._itemIdList + '&columns=id,name,description';
		productDescriptionsRequestor.generateRequest();
		var imageUrlMap = new Map();
		for (let productImage of data.detail.response.product_images.records) {
			var firstImage = imageUrlMap.get(productImage[0]);
			if (!firstImage) {
				imageUrlMap.set(productImage[0], productImage[1]);
			}
		}
		this._imageUrlMap = imageUrlMap;
	}

	_productDescriptionsReceived(data) {
		var target = this.$.productsList;
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}
		for (let product of data.detail.response.product_descriptions.records) {
			var liElement = document.createElement('li');
			var aElement = document.createElement('a');
			aElement.setAttribute('href', this._hrefPrefix + '/product/' + product[0]);
			aElement.setAttribute('product', product[0]);
			var productCard = document.createElement('fairshop-product-card');
			productCard.name = product[1];
			productCard.description = product[2];
			var imageUrl = this._imageUrlMap.get(product[0]);
			if (imageUrl) {
				productCard.imageUrl = 'http://bukhtest.alphaplanweb.de/' + imageUrl;
			}
			aElement.appendChild(productCard);
			liElement.appendChild(aElement);
			target.appendChild(liElement);
		}
	}

}
customElements.define("fairshop-products-list", FairshopProductsList);
