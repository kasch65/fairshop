import { PolymerElement, html } from '@polymer/polymer';
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
				:host {
					@apply --faishop-host;
				}
				h1,
				h2,
				h3 {
					@apply --faishop-header;
				}
				:host {
					line-height: 1.3rem;
				}
				.product-card {
					width: 12rem;
					height: 18rem;
					text-align: center;
					padding: 0.5rem;
					margin: 0.5rem;
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
