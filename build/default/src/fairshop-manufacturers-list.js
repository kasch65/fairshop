import { PolymerElement, html } from "../node_modules/@polymer/polymer/polymer-element.js";
import "../node_modules/@polymer/iron-ajax/iron-ajax.js";
import './fairshop-manufactur-card.js';
/**
 * @class
 */

export class FairshopManufacturersList extends PolymerElement {
  static get properties() {
    return {
      restUrl: {
        type: String
      },
      _manufacturerDescriptions: {
        type: Array
      },
      _logoUrlMap: {
        type: Map
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

  _requestManufacturerDescriptions() {
    this.$.requestManufacturerDescriptions.generateRequest();
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
      var manufacurersCard = document.createElement('fairshop-manufactur-card');
      manufacurersCard.name = manufacturer[1];

      var logoUrl = this._logoUrlMap.get(manufacturer[0]);

      if (logoUrl) {
        manufacurersCard.logoUrl = 'http://bukhtest.alphaplanweb.de/' + logoUrl;
      }

      aElement.appendChild(manufacurersCard);
      liElement.appendChild(aElement);
      target.appendChild(liElement);
    }
  }

}
customElements.define("fairshop-manufacturers-list", FairshopManufacturersList);