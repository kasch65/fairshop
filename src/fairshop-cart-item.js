import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
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
			_onePrice: {
				type: Number,
				observer: '_allPriceChanged'
			},
			_allPrice: {
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
					width: 100%;
				}
				.item>div {
					padding: .5rem;
					border-style: solid;
					border-width: .5px;
				}
				fairshop-image {
					width: 3rem;
					height: 3rem;
				}
			</style>

			<div class="item">
				<div class="image">
					<template is="dom-if" if="[[_image]]">
						<fairshop-image id="image" sizing="contain" src="[[imageUrl]][[_image]]"></fairshop-image>
					</template>
				</div>
				<div class="id">
					[[productId]]
				</div>
				<div class="name">
					[[_name]]
				</div>
				<div class="count">
					{{count}}
				</div>
				<div class="one-price">
					[[_onePrice]]€
				</div>
				<div class="all-price">
					[[_allPrice]]€
				</div>
			</div>

			<iron-ajax 
				id="getProductDescriptions"
				url="[[restUrl]]product_search_copy?filter=id,eq,[[productId]]&columns=price,available,name"
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
			this._onePrice = productInfo[0];
			this._name = productInfo[2];
		}
	}

	_productImageReceived(data) {
		if ( data.detail.response && data.detail.response.product_images && data.detail.response.product_images.records) {
			var image = data.detail.response.product_images.records[0];
			this._image = image;
		}
	}

	_allPriceChanged() {
		this._allPrice = (this.count * this._onePrice).toFixed(2);
	}

}
customElements.define("fairshop-cart-item", FairshopCartItem);
