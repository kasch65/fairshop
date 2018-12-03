import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './fairshop-image.js';
import './fairshop-styles.js';

/**
 * @class
 */
export class FairshopManufacturerCard extends PolymerElement {
	static get properties() {
		return {
			logoUrl: {
				type: String,
				value: null
			},
			name: {
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
				.manufacturer-card {
					width: 100%;
					height: 100%;
					text-align: center;
					padding: 0.5rem;
					border-style: solid;
					border-width: 0.5px;
					border-color: var(--google-grey-300);
				}
				.manufacturer-card:hover {
					box-shadow: 2px 4px 10px rgba(0,0,0,.2);
				}
				.manufacturer-card fairshop-image {
					width: 100%;
					height: 100%;
				}
			</style>
			<div class="manufacturer-card" title$="[[name]]">
				<template is="dom-if" if="[[logoUrl]]">
					<fairshop-image class="manufacturer-img" src="[[logoUrl]]" placeholder="/src/img/no_picture.png"></fairshop-image>
					</template>
				<template is="dom-if" if="[[!logoUrl]]">
					<div>[[name]]</div>
				</template>
			</div>
		`;
	}

}
customElements.define("fairshop-manufacturer-card", FairshopManufacturerCard);
