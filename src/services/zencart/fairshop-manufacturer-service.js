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
				url="[[restUrl]]manufacturers_view?columns=id,name,image&filter=id,eq,[[selectedManufacturer]]"
				handle-as="json">
			</iron-ajax>
		`;
	}

	_manufacturerChanged() {
		if (!this.selectedManufacturer) {
			this.manufacturer = null;
		}
		else {
			var completions = [
				this.$.requestManufacturerDescription.generateRequest().completes
			];
			var that = this;
			Promise.all(completions).then(function (completions) {
				var newManufacturer = {
					'name': completions[0].response.manufacturers_view.records[0][1],
					'description': '',
					'images': Array()
				}
				newManufacturer.images.push(that.imageUrl + completions[0].response.manufacturers_view.records[0][2]);
				that.manufacturer = newManufacturer;
			});
		}
	}

}
customElements.define("fairshop-manufacturer-service", FairshopManufacturerService);
