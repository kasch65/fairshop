import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './fairshop-image.js';
import './fairshop-styles.js';

/**
 * @class
 */
export class FairshopCartItem extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			productId: {
				type: Number,
				observer: '_productIdChanged'
			},
			_name: {
				type: String
			},
			_image: {
				type: String
			},
			count: {
				type: Number,
				observer: '_allPriceChanged'
			},
			_oneNettoPrice: {
				type: Number,
				observer: '_allPriceChanged'
			},
			_onePrice: {
				type: Number,
				observer: '_allPriceChanged'
			},
			allNettoPrice: {
				type: Number
			},
			allPrice: {
				type: Number
			}
		};
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html `
			<style include="fairshop-styles">
				.item {
					display: flex;
					align-items: center;
					width: 100%;
					border-bottom: solid;
					border-width: .5px;
					border-color: #888;
				}
				.item>div {
					padding: .5rem;
				}
				fairshop-image {
					width: 4rem;
					height: 4rem;
				}
				.item>.image {
					padding: 0 .5rem;
				}
				.prod-id {
					width: 5rem;
				}
				.name {
					flex-grow: 4;
				}
				.count {
					width: 5rem;
				}
				.count>paper-input {
					text-align: right;
				}
				.one-price {
					width: 5rem;
					text-align: right;
				}
				.all-netto-price {
					width: 5rem;
					text-align: right;
				}
				.tax {
					width: 5rem;
					text-align: right;
				}
				.all-price {
					width: 5rem;
					text-align: right;
				}
				.remove {
					width: 5rem;
				}
			</style>

			<div class="item">
					<div class="image">
						<a href="#">
							<fairshop-image id="image" sizing="contain" src="[[imageUrl]][[_image]]"></fairshop-image>
						</a>
					</div>
					<div class="prod-id">
						<a href="#">[[productId]]</a>
					</div>
					<div class="name">
						<a href="#">[[_name]]</a>
					</div>
				<div class="count">
					<paper-input id="count" label="Anzahl" value="{{count}}" no-label-float></paper-input>
				</div>
				<div class="one-price">
					[[_oneNettoPrice]]€
				</div>
				<div class="all-netto-price">
					[[allNettoPrice]]€
				</div>
				<div class="tax">
					[[_tax]]%
				</div>
				<div class="all-price">
					[[allPrice]]€
				</div>
				<div class="remove">
					<paper-icon-button slot="suffix" icon="icons:clear" on-click="_remove"></paper-icon-button>
				</div>
			</div>

			<iron-ajax 
				id="getProductDescriptions"
				url="[[restUrl]]product_search_copy?filter=id,eq,[[productId]]&columns=nettoPrice,price,tax,available,name"
				handle-as="json"
				on-response="_getProductDescriptionsReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductImages"
				url="[[restUrl]]product_images?filter=productId,eq,[[productId]]&columns=small&order=pos&page=1,1"
				handle-as="json"
				on-response="_productImageReceived">
			</iron-ajax>
		`;
	}

	_productIdChanged() {
		this.$.getProductDescriptions.generateRequest();
		this.$.requestProductImages.generateRequest();
	}

	_getProductDescriptionsReceived(data) {
		if ( data.detail.response && data.detail.response.product_search_copy && data.detail.response.product_search_copy.records) {
			var productInfo = data.detail.response.product_search_copy.records[0];
			this._oneNettoPrice = productInfo[0];
			this._onePrice = productInfo[1];
			this._tax = productInfo[2];
			this._name = productInfo[4];
		}
	}

	_productImageReceived(data) {
		if ( data.detail.response && data.detail.response.product_images && data.detail.response.product_images.records) {
			var image = data.detail.response.product_images.records[0];
			this._image = image;
		}
	}

	_allPriceChanged() {
		var allNettoPrice = this.count * this._oneNettoPrice;
		if (!isNaN(allNettoPrice)) {
			this.allNettoPrice = allNettoPrice.toFixed(2);
		}
		var allPrice = this.count * this._onePrice;
		if (!isNaN(allPrice)) {
			this.allPrice = allPrice.toFixed(2);
			document.dispatchEvent(new CustomEvent('cart-event', {detail: 'price-changed'}));
		}
	}

	_remove() {
		this.parentElement.removeChild(this);
		document.dispatchEvent(new CustomEvent('cart-event', {detail: 'price-changed'}));
	}

}
customElements.define("fairshop-cart-item", FairshopCartItem);
