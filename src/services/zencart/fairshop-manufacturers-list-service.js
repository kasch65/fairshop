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
				id="requestManufacturerDescriptions"
				handle-as="json">
			</iron-ajax>
		`;
	}

	ready() {
		super.ready();
	}

	_search() {
		var completions = null;
		if (this.searchString) {
			console.log('Searching manufacturer: ' + this.searchString);
			this.$.requestManufacturerDescriptions.url = this.restUrl + 'manufacturers_view?columns=id,name,image&filter=name,cs,' + this.searchString + '&satisfy=any';
			completions = [
				this.$.requestManufacturerDescriptions.generateRequest().completes
			];
		}
		else {
			this.$.requestManufacturerDescriptions.url = this.restUrl + 'manufacturers_view?columns=id,name,image';
			completions = [
				this.$.requestManufacturerDescriptions.generateRequest().completes
			];
		}
		var that = this;
		Promise.all(completions).then(function (completions) {
			var manufacturersMap = new Map();
			for (let manufacturerRecord of completions[0].response.manufacturers_view.records) {
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
				manufacturer.imageUrl = that.imageUrl + manufacturerRecord[2];
				manufacturersMap.set(manufacturer.id, manufacturer);
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
