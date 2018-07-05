import {
	PolymerElement,
	html
} from "@polymer/polymer/polymer-element";
import '@polymer/app-layout/app-layout.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import './fairshop-manufacturers-list.js';
import './fairshop-manufacturer.js';
import './fairshop-categories-tree.js';
import './fairshop-products-list.js';
import './fairshop-product.js';

/**
 * @class
 */
export class FairshopApp extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			selectedCategory: {
				type: Number
			},
			selectedManufacturer: {
				type: Number
			},
			selectedProduct: {
				type: Number
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
				fairshop-app {
					background-color: var(--primary-background-color);
					color: var(--primary-text-color);
				}
				paper-spinner-lite {
					left: 50%;
					top: 50%;
					position: fixed;
				}
				.list {
					width: 30%;
					display: inline-block;
					vertical-align:top;
					overflow: auto;
				}
				.preview {
					width: 69%;
					display: inline-block;
					vertical-align:top;
				}
				app-header {
					background-color: var(--google-blue-700);
					color: var(--paper-grey-50);
				}
			</style>
			<app-header-layout>
				<app-header slot="header" fixed="" effects="waterfall">
					<app-toolbar>
						<div main-title>fairshop-app</div>
					</app-toolbar>
				</app-header>

				<div id="categories" page-name="categories">
					<fairshop-categories-tree rest-url="[[restUrl]]" selected-category="{{selectedCategory}}" selected-manufacturer="{{selectedManufacturer}}" selected-product="{{selectedProduct}}"></fairshop-categories-tree>
				</div>
				<div id="maufacturers" page-name="maufacturers">
					<fairshop-manufacturers-list rest-url="[[restUrl]]" selected-manufacturer="{{selectedManufacturer}}" selected-category="{{selectedCategory}}" selected-product="{{selectedProduct}}"></fairshop-manufacturers-list>
				</div>
				<div id="maufacturer" page-name="maufacturer">
					<fairshop-manufacturer rest-url="[[restUrl]]" selected-manufacturer="[[selectedManufacturer]]"></fairshop-manufacturer>
				</div>
				<div id="products" page-name="products">
					<fairshop-products-list rest-url="[[restUrl]]" selected-category="[[selectedCategory]]" selected-manufacturer="[[selectedManufacturer]]" selected-product="{{selectedProduct}}"></fairshop-products-list>
				</div>
				<div id="product" page-name="product">
					<fairshop-product rest-url="[[restUrl]]" selected-product="[[selectedProduct]]"></fairshop-product>
				</div>
			<app-header-layout>
			<paper-toast id="toast"></paper-toast>
		`;
	}
}
customElements.define("fairshop-app", FairshopApp);