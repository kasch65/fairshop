import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import '@polymer/iron-image/iron-image.js';

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
					height: 16rem;
					color: var(--google-grey-700);
					text-align: center;
					padding: 0.5rem;
					margin: 0.5rem;
					border-style: solid;
					border-width: 0.5px;
					border-color: var(--google-grey-300);
				}
				.product-card iron-image {
					width: 100%;
					height: 12rem;
				}
			</style>
			<div class="product-card" title$="[[description]]">
				<iron-image class="product-img" sizing="contain" src="[[imageUrl]]" alt="no image"></iron-image>
				<div>[[name]]</div>
			</div>
		`;
	}

}
customElements.define("fairshop-product-card", FairshopProductCard);
