import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './fairshop-image.js';
import './fairshop-styles.js';
import './services/zencart/fairshop-manufacturer-service';

/**
 * @class
 */
export class FairshopManufacturer extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			selectedManufacturer: {
				type: Number
			},
			_manufacturer: {
				type: Object
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
				.manufacturer {
					overflow: auto;
				}
				.images {
					width: 50%;
					float: left;
				}
				.manufacturer-img {
					width: 100%;
					height: 20rem;
				}
				#manufacturerInfo {
					width: 50%;
					float: left;
				}
				h1 {
					text-align: center;
				}
			</style>
			<fairshop-manufacturer-service rest-url="[[restUrl]]" image-url="[[imageUrl]]"selected-manufacturer="[[selectedManufacturer]]" manufacturer="{{_manufacturer}}"></fairshop-manufacturer-service>
			<div class="manufacturer">
				<h1>[[_manufacturer.name]]</h1>
				<div class="images">
					<template is="dom-repeat" items="[[_manufacturer.images]]" as="manufacturerImage">
						<div class="tile-image">
							<fairshop-image class="manufacturer-img" src="[[manufacturerImage]]" placeholder="/src/img/no_picture.png"></fairshop-image>
						</div>
					</template>
				</div>
				[[_setManufacturerDescriptionHtml(_manufacturer.description)]]
				<div id="manufacturerInfo">
				</div>
			</div>
		`;
	}

	_setManufacturerDescriptionHtml(html) {
		// Add HTML to description
		this.$.manufacturerInfo.innerHTML = html;
	}

}
customElements.define("fairshop-manufacturer", FairshopManufacturer);
