import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import '@polymer/iron-image/iron-image.js';

/**
 * @class
 */
export class FairshopManufacturCard extends PolymerElement {
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
			<style>
				.manufacturer-card {
					width: 6rem;
					height: 6rem;
					color: var(--google-grey-700);
					text-align: center;
					padding: 0.5rem;
					margin: 0.5rem;
					border-style: solid;
					border-width: 0.5px;
					border-color: var(--google-grey-300);
				}
				.manufacturer-card iron-image {
					width: 100%;
					height: 100%;
				}
			</style>
			<div class="manufacturer-card" title$="[[name]]">
				<template is="dom-if" if="[[logoUrl]]">
					<iron-image class="manufacturer-img" sizing="contain" src="[[logoUrl]]" alt="no image"></iron-image>
				</template>
				<template is="dom-if" if="[[!logoUrl]]">
					<div>[[name]]</div>
				</template>
			</div>
		`;
	}

}
customElements.define("fairshop-manufactur-card", FairshopManufacturCard);
