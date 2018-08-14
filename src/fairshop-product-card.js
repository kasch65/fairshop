import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './fairshop-image.js';
import './fairshop-styles.js';

/**
 * @class
 */
export class FairshopProductCard extends PolymerElement {
	static get properties() {
		return {
			imageUrl: {
				type: String
			},
			name: {
				type: String
			},
			description: {
				type: String
			},
			price: {
				type: String
			},
			manufacturerName: {
				type: String
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
				:host {
					line-height: 1.3rem;
				}
				.product-card {
					box-sizing: border-box;
					width: 100%;
					min-height: 100%;
					text-align: center;
					maring: 0;
					padding: 0.5rem;
					border-style: solid;
					border-width: 0.5px;
					border-color: var(--google-grey-300);
				}
				.product-card:hover {
					box-shadow: 2px 4px 10px rgba(0,0,0,.2);
				}
				.product-card>div {
					hyphens: auto;
				}
				.product-card fairshop-image {
					width: 100%;
					height: 12rem;
				}
			</style>
			<div class="product-card" title$="[[description]]">
				<fairshop-image class="product-img" src="[[imageUrl]]" placeholder="/src/img/no_picture.png"></fairshop-image>
				<div>[[name]]</div>
				<div>von [[manufacturerName]]</div>
				<div><b>[[price]]€</b></div>
			</div>
		`;
	}

}
customElements.define("fairshop-product-card", FairshopProductCard);
