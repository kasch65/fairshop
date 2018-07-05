import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import '@polymer/iron-image/iron-image.js';

/**
 * @class
 */
export class FairshopManufacturer extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			selectedManufacturer: {
				type: Number,
				observer: "_manufacturerChanged"
			},
			_manufacturerDescription: {
				type: Object
			},
			_manufacturerImages: {
				type: Array
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
				.manufacturer {
					overflow: auto;
				}
				.images {
					width: 49%;
					float: left;
				}
				.manufacturer-img {
					width: 100%;
					height: 18rem;
				}
				.info {
					width: 49%;
					float: left;
				}
				h1 {
					text-align: center;
				}
			</style>
			<div class="manufacturer">
				<h1>[[_manufacturerDescription.2]]</h1>
				<div class="images">
					<template is="dom-repeat" items="[[_manufacturerImages]]" as="manufacturerImage">
						<div class="medium-image">
							<!--<img href$="[[manufacturerImage.0]]" src="http://bukhtest.alphaplanweb.de/[[manufacturerImage.4]]" alt="[[manufacturerImage.4]]"/>-->
							<iron-image class="manufacturer-img" sizing="contain" src="http://bukhtest.alphaplanweb.de/[[manufacturerImage.4]]" alt\$="[[manufacturerImage.4]]"></iron-image>
						</div>
					</template>
				</div>
				<div class="info">
					<div>[[_manufacturerDescription.3]]</div>
				</div>
			</div>

			<iron-ajax 
				id="requestManufacturerDescription"
				url="[[restUrl]]manufacturer_descriptions?filter=manufacturerId,eq,[[selectedManufacturer]]"
				handle-as="json"
				on-response="_manufacturerDescriptionReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestManufacturerImages"
				url="[[restUrl]]manufacturer_images?filter=manufacturerId,eq,[[selectedManufacturer]]"
				handle-as="json"
				on-response="_requestManufacturerImagesReceived">
			</iron-ajax>
		`;
	}

	_manufacturerChanged() {
		if (!this.selectedManufacturer) {
			this._manufacturerDescription = null;
			this._manufacturerImages = null;
		}
		else {
			this.$.requestManufacturerDescription.generateRequest();
			this.$.requestManufacturerImages.generateRequest();
		}
	}

	_manufacturerDescriptionReceived(data) {
		this._manufacturerDescription = data.detail.response.manufacturer_descriptions.records[0];
	}

	_requestManufacturerImagesReceived(data) {
		this._manufacturerImages = data.detail.response.manufacturer_images.records;
	}

}
customElements.define("fairshop-manufacturer", FairshopManufacturer);
