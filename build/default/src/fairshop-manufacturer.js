import { PolymerElement, html } from "../node_modules/@polymer/polymer/polymer-element.js";
import "../node_modules/@polymer/iron-image/iron-image.js";
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
    return html`
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
					height: 20rem;
				}
				#manufacturerInfo {
					width: 49%;
					float: left;
				}
				h1 {
					text-align: center;
				}
			</style>
			<div class="manufacturer">
				<h1>[[_manufacturerDescription.0]]</h1>
				<div class="images">
					<template is="dom-repeat" items="[[_manufacturerImages]]" as="manufacturerImage">
						<div class="tile-image">
						<iron-image class="manufacturer-img" sizing="contain" src="http://bukhtest.alphaplanweb.de/[[manufacturerImage.0]]" alt\$="[[manufacturerImage.0]]"></iron-image>
						</div>
					</template>
				</div>
				<div id="manufacturerInfo">
				</div>
			</div>

			<iron-ajax 
				id="requestManufacturerDescription"
				url="[[restUrl]]manufacturer_descriptions?filter=manufacturerId,eq,[[selectedManufacturer]]&columns=name,description"
				handle-as="json"
				on-response="_manufacturerDescriptionReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestManufacturerImages"
				url="[[restUrl]]manufacturer_images?filter[]=manufacturerId,eq,[[selectedManufacturer]]&filter[]=use,eq,Herstellerkachel&columns=file"
				handle-as="json"
				on-response="_requestManufacturerImagesReceived">
			</iron-ajax>
		`;
  }

  _manufacturerChanged() {
    if (!this.selectedManufacturer) {
      this._manufacturerDescription = null;
      this._manufacturerImages = null;
    } else {
      this.$.requestManufacturerDescription.generateRequest();
      this.$.requestManufacturerImages.generateRequest();
    }
  }

  _manufacturerDescriptionReceived(data) {
    this._manufacturerDescription = data.detail.response.manufacturer_descriptions.records[0]; // Add HTML to description

    this.$.manufacturerInfo.innerHTML = this._manufacturerDescription[1];
  }

  _requestManufacturerImagesReceived(data) {
    this._manufacturerImages = data.detail.response.manufacturer_images.records;
  }

}
customElements.define("fairshop-manufacturer", FairshopManufacturer);