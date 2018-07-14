import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import './fairshop-image.js';

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
			<style>
				.product-card {
					width: 12rem;
					height: 18rem;
					color: var(--google-grey-700);
					text-align: center;
					padding: 0.5rem;
					margin: 0.5rem;
					border-style: solid;
					border-width: 0.5px;
					border-color: var(--google-grey-300);
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
				<fairshop-image class="product-img" src="[[imageUrl]]" placeholder="http://localhost:8081/src/img/no_picture.png"></fairshop-image>
				<div>[[name]]</div>
				<div>von [[manufacturerName]]</div>
				<div><b>[[price]]€</b></div>
			</div>
		`;
	}

}
customElements.define("fairshop-product-card", FairshopProductCard);
