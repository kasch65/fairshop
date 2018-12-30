import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './fairshop-image.js';
import './fairshop-styles.js';
import './services/zencart/fairshop-cart-item-service.js';

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
			cart: {
				type: Object,
				notify: true
			},
			item: {
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
					width: 6rem;
					text-align: right;
				}
				.all-netto-price {
					width: 6rem;
					text-align: right;
				}
				.discount {
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

			<fairshop-cart-item-service id="cartItemService" rest-url="[[restUrl]]" image-url="[[imageUrl]]" cart="{{cart}}" item="{{item}}"></fairshop-cart-item-service>

			<div class="item">
					<div class="image">
						<a href="[[item.url]]">
							<fairshop-image id="image" sizing="contain" src="[[item.image]]"></fairshop-image>
						</a>
					</div>
					<div class="prod-id">
						<a href="[[item.url]]">[[item.id]]</a>
					</div>
					<div class="name">
						<a href="[[item.url]]">[[item.name]]</a>
					</div>
				<div class="count">
					<paper-input id="count" label="Anzahl" value="{{item.count}}" no-label-float></paper-input>
				</div>
				<div class="one-price">
					[[item.oneNettoPrice]]€
				</div>
				<div class="discount">
					[[item.quantityDiscount]]%
				</div>
				<div class="all-netto-price">
					[[item.allNettoPrice]]€
				</div>
				<div class="tax">
					[[item.tax]]%
				</div>
				<div class="all-price">
					[[item.allPrice]]€
				</div>
				<div class="remove">
					<paper-icon-button slot="suffix" icon="icons:clear" on-click="_remove"></paper-icon-button>
				</div>
			</div>
		`;
	}

	_remove() {
		var pos = -1;
		var i = 0;
		for (let item of this.cart.items) {
			if (item.id == this.item.id) {
				pos = i;
				break;
			}
			++i;
		}
		if (pos >= 0) {
			this.splice('cart.items', pos, 1);
		}
	}

}
customElements.define("fairshop-cart-item", FairshopCartItem);
