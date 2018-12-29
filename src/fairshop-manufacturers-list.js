import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './services/bukhtest/fairshop-manufacturers-list-service.js';
import './fairshop-manufacturer-card.js';
import './fairshop-styles.js';

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
			_manufacturers: {
				type: Array
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
			<style include="fairshop-styles">
				.manufacturers {
					overflow: auto;
				}
				.active {
					background-color: var(--google-blue-100);
				}
				ul {
					display: grid;
					grid-gap: .2rem;
					grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
					list-style-type: none;
					padding: 0;
				}
				li {
					height: 7rem;
				}
				li>a {
					text-decoration: none;
				}
			</style>
			<fairshop-manufacturers-list-service id="manufacturersListService" rest-url="[[restUrl]]" image-url="[[imageUrl]]" manufacturers="{{_manufacturers}}" search-string="[[searchString]]"></fairshop-manufacturers-list-service>
			<div class="manufacturers">
				<h1>Herstellerliste</h1>
				<template is="dom-if" if="[[searchString]]">
					<div class="filtered">Filter: <b>[[searchString]]</b></div>
				</template>
				<ul id="manufacturersList">
					<template is="dom-repeat" items="[[_manufacturers]]" as="manufacturer">
						<li>
							<a href="[[manufacturer.url]]">
								<fairshop-manufacturer-card name="[[manufacturer.name]]" logo-url="[[manufacturer.imageUrl]]"></fairshop-manufacturer-card>
							</a>
						</li>
					</template>
				</ul>
			</div>
		`;
	}

}
customElements.define("fairshop-manufacturers-list", FairshopManufacturersList);
