import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';

/**
 * @class
 */
export class FairshopManufacturerService extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			selectedManufacturer: {
				type: Number,
				observer: "_manufacturerChanged"
			},
			manufacturer: {
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
			<iron-ajax
				id="requestManufacturerDescription"
				url="[[restUrl]]manufacturer_descriptions?filter=manufacturerId,eq,[[selectedManufacturer]]&columns=name,description"
				handle-as="json">
			</iron-ajax>

			<iron-ajax
				id="requestManufacturerImages"
				url="[[restUrl]]manufacturer_images?filter[]=manufacturerId,eq,[[selectedManufacturer]]&filter[]=use,eq,Herstellerkachel&columns=file"
				handle-as="json">
			</iron-ajax>
		`;
	}

	_manufacturerChanged() {
		if (!this.selectedManufacturer) {
			this.manufacturer = null;
		}
		else {
			var completions = [this.$.requestManufacturerDescription.generateRequest().completes, this.$.requestManufacturerImages.generateRequest().completes];
			var that = this;
			Promise.all(completions).then(function (completions) {
				var newManufacturer = Object();
				newManufacturer.name = completions[0].response.manufacturer_descriptions.records[0][0];
				newManufacturer.description = completions[0].response.manufacturer_descriptions.records[0][1];
				newManufacturer.images = Array();
				for (let imageRecord of completions[1].response.manufacturer_images.records[0]) {
					newManufacturer.images.push(that.imageUrl + imageRecord);
				}
				that.manufacturer = newManufacturer;
			});
		}
	}

}
customElements.define("fairshop-manufacturer-service", FairshopManufacturerService);
