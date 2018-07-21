import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/iron-ajax';
import './fairshop-manufacturer-card.js';

/**
 * @class
 */
export class FairshopManufacturersList extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			_manufacturerDescriptions: {
				type: Array
			},
			_logoUrlMap: {
				type: Map
			},
			searchString: {
				type: String,
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
			<style>
				.manufacturers {
					overflow: auto;
				}
				.active {
					background-color: var(--google-blue-100);
				}
				ul {
					list-style-type: none;
				}
				li {
					float: left;
				}
				li>a {
					text-decoration: none;
				}
			</style>
			<div class="manufacturers">
				<h1>Herstellerliste</h1>
				<template is="dom-if" if="[[searchString]]">
					<div class="filtered">Filter: <b>[[searchString]]</b></div>
				</template>
				<ul id="manufacturersList">
				</ul>
			</div>

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
		this.$.requestManufacturerImages.generateRequest();
	}

	_manufacturerImagesReceived(data) {
		this.$.requestManufacturerDescriptions.generateRequest();
		var imageUrlMap = new Map();
		for (let manufacturerImage of data.detail.response.manufacturer_images.records) {
			if (manufacturerImage[1] == 'Kategorie-Bild') {
				imageUrlMap.set(manufacturerImage[0], manufacturerImage[2]);
			}
		}
		this._logoUrlMap = imageUrlMap;
	}

	_manufacturerDescriptionsReceived(data) {
		this._manufacturerDescriptions = data.detail.response.manufacturer_descriptions.records;
		var target = this.$.manufacturersList;
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}
		for (let manufacturer of data.detail.response.manufacturer_descriptions.records) {
			var liElement = document.createElement('li');
			var aElement = document.createElement('a');
			aElement.setAttribute('href', '/manufacturers/' + manufacturer[0]);
			var manufacurersCard = document.createElement('fairshop-manufacturer-card');
			manufacurersCard.name = manufacturer[1];
			var logoUrl = this._logoUrlMap.get(manufacturer[0]);
			if (logoUrl) {
				manufacurersCard.logoUrl = this.imageUrl + logoUrl;
			}
			aElement.appendChild(manufacurersCard);
			liElement.appendChild(aElement);
			target.appendChild(liElement);
		}
		// Let tests wait until ajax data has been evaluated and this event to be fired
		this.dispatchEvent(new CustomEvent('test-event', {detail: 'ajax-loaded'}));
	}

	_search() {
		if (this._logoUrlMap) {
			if (this.searchString) {
				console.log('Searching manufacturer: ' + this.searchString);
				this.$.searchManufacturerDescriptions.url = this.restUrl + 'manufacturer_descriptions?filter[]=name,cs,' + this.searchString + '&filter[]=description,cs,' + this.searchString + '&satisfy=any&columns=manufacturerId,name';
				this.$.searchManufacturerDescriptions.generateRequest();
			}
			else {
				this.$.requestManufacturerDescriptions.generateRequest();
			}
		}

	}

}
customElements.define("fairshop-manufacturers-list", FairshopManufacturersList);
