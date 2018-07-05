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
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
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
			route: {
				Object
			},
			routeData: {
				type: Object
			},
			subRoute: {
				type: Object
			},
			_homeActive: {
				type: Boolean,
				value: true
			},
			_categoriesActive: {
				type: Boolean,
				value: false
			},
			_manufacturersActive: {
				type: Boolean,
				value: false
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
				app-header a {
					color: var(--paper-grey-50);
					text-decoration: none;
				}
				#footer {
					padding: 1rem;
					background-color: var(--google-blue-700);
					color: var(--paper-grey-50);
				}
			</style>

			<app-location route="{{route}}"></app-location>
			<app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subRoute}}"></app-route>
			
			<app-header-layout>
				<app-header slot="header" fixed="" effects="waterfall">
					<app-toolbar>
						<div main-title>fairshop demo</div>
						<div class="left-bar-item">
							<a href="/"><paper-button>Home</paper-button></a>
							<a href="/categories"><paper-button>Categories</paper-button></a>
							<a href="/manufacturers"><paper-button>Manufacturers</paper-button></a>
						</div>
					</app-toolbar>
				</app-header>

				<template is="dom-if" if="[[_homeActive]]">
					<div id="home" page-name="home">
						<h1>fairshop</h1>
						<h2>fair and always open</h2>
					</div>
				</template>
				<template is="dom-if" if="[[_categoriesActive]]">
					<div id="categories" page-name="categories">
						<fairshop-categories-tree rest-url="[[restUrl]]"></fairshop-categories-tree>
					</div>
				</template>
				<template is="dom-if" if="[[_manufacturersActive]]">
					<div id="manufacturers" page-name="manufacturers">
						<fairshop-manufacturers-list rest-url="[[restUrl]]"></fairshop-manufacturers-list>
					</div>
					<template is="dom-if" if="[[subRoute.path.length]]">
						<div id="maufacturer" page-name="maufacturer">
							<fairshop-manufacturer rest-url="[[restUrl]]" route="[[subRoute]]"></fairshop-manufacturer>
						</div>
					</template>
				</template>
				<template is="dom-if" if="[[_categoriesActive]]">
					<template is="dom-if" if="[[subRoute.path.length]]">
						<div id="products" page-name="products">
							<fairshop-products-list rest-url="[[restUrl]]" category-route="[[subRoute]]"></fairshop-products-list>
						</div>
						<div id="product" page-name="product">
							<fairshop-product rest-url="[[restUrl]]" route="[[subRoute]]"></fairshop-product>
						</div>
					</template>
				</template>

				<template is="dom-if" if="[[_manufacturersActive]]">
					<template is="dom-if" if="[[subRoute.path.length]]">
						<div id="namufacturerProducts" page-name="products">
							<fairshop-products-list rest-url="[[restUrl]]" manufacturer-route="[[subRoute]]"></fairshop-products-list>
						</div>
						<div id="namufacturerProduct" page-name="product">
							<fairshop-product rest-url="[[restUrl]]" route="[[subRoute]]"></fairshop-product>
						</div>
					</template>
				</template>

				<div id="footer">(c) fairshop 2018</div>
			<app-header-layout>
			<paper-toast id="toast"></paper-toast>
		`;
	}

	static get observers() {
		return ['_routePageChanged(routeData.page)']
	}

	_routePageChanged(page) {
		console.log('fairshop-app.route.path: ' + this.route.path);
		console.log('fairshop-app.routeData.page: ' + this.routeData.page);
		console.log('fairshop-app.subRoute.path: ' + this.subRoute.path);
		if (this.routeData.page == '') {
			this._homeActive = true;
			this._categoriesActive = false;
			this._manufacturersActive = false;
		}
		else if (this.routeData.page == 'categories') {
			this._homeActive = false;
			this._categoriesActive = true;
			this._manufacturersActive = false;
		}
		else if (this.routeData.page == 'manufacturers') {
			this._homeActive = false;
			this._categoriesActive = false;
			this._manufacturersActive = true;
		}
	}

}
customElements.define("fairshop-app", FairshopApp);