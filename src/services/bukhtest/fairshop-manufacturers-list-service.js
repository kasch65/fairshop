import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax';

/**
 * @class
 */
export class FairshopManufacturersListService extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			manufacturers: {
				type: Array,
				notify: true
			},
			searchString: {
				type: String,
				value: null,
				observer: '_search'
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
				id="requestManufacturerImages"
				url="[[restUrl]]manufacturer_images?columns=manufacturerId,use,file"
				handle-as="json"
				on-response="_manufacturerImagesReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestManufacturerDescriptions"
				url="[[restUrl]]manufacturer_descriptions?columns=manufacturerId,name"
				handle-as="json"
				on-response="_manufacturerDescriptionsReceived">
			</iron-ajax>

			<iron-ajax 
				id="searchManufacturerDescriptions"
				handle-as="json"
				on-response="_manufacturerDescriptionsReceived">
			</iron-ajax>
		`;
	}

	ready() {
		super.ready();
		//this._search();
	}

	_search() {
		var completions = null;
		if (this.searchString) {
			console.log('Searching manufacturer: ' + this.searchString);
			this.$.searchManufacturerDescriptions.url = this.restUrl + 'manufacturer_descriptions?filter[]=name,cs,' + this.searchString + '&filter[]=description,cs,' + this.searchString + '&satisfy=any&columns=manufacturerId,name';
			completions = [this.$.searchManufacturerDescriptions.generateRequest().completes, this.$.requestManufacturerImages.generateRequest().completes];
		}
		else {
			completions = [this.$.requestManufacturerDescriptions.generateRequest().completes, this.$.requestManufacturerImages.generateRequest().completes];
		}
		var that = this;
		Promise.all(completions).then(function (completions) {
			var manufacturersMap = new Map();
			for (let manufacturerRecord of completions[0].response.manufacturer_descriptions.records) {
				var id = Number(manufacturerRecord[0]);
				var manufacturer = manufacturersMap.get(id);
				if (!manufacturer) {
					manufacturer = {
						'id': id,
						'url': null,
						'name': null,
						'imageUrl': null
					}
				} 
				manufacturer.url = '/manufacturers/' + id;
				manufacturer.name = manufacturerRecord[1];
				manufacturersMap.set(manufacturer.id, manufacturer);
			}
			for (let manufacturerImageRecord of completions[1].response.manufacturer_images.records) {
				if (manufacturerImageRecord[1] == 'Herstellerlogo') {
					var manufacturer2 = manufacturersMap.get(Number(manufacturerImageRecord[0]));
					if (manufacturer2) {
						manufacturer2.imageUrl = that.imageUrl + manufacturerImageRecord[2];
					}
					// Ignore images for manufacturers that are not in the result
				}
			}
			var newManufaturers = Array();
			for (var value of manufacturersMap.values()) {
				newManufaturers.push(value);
			}
			that.manufacturers = newManufaturers;
			// Let tests wait until ajax data has been evaluated and this event to be fired
			that.dispatchEvent(new CustomEvent('test-event', {detail: 'ajax-loaded'}));
		});
	}

}
customElements.define("fairshop-manufacturers-list-service", FairshopManufacturersListService);
