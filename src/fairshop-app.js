import {
	PolymerElement,
	html
} from "@polymer/polymer/polymer-element";
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-layout/app-layout.js';
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
			route: {
				Object
			},
			routeData: {
				type: Object
			},
			subRoute: {
				type: Object
			},
			groupRouteData: {
				type: Object
			},
			groupSubRoute: {
				type: Object
			},
			productsRouteData: {
				type: Object
			},
			productsSubRoute: {
				type: Object
			},
			productRouteData: {
				type: Object
			},
			productSubRoute: {
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
			},
			_manufacturerActive: {
				type: Boolean,
				value: false
			},
			_productsActive: {
				type: Boolean,
				value: false
			},
			_productActive: {
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
				[main-title] {
					font-weight: bolder;
				}
				paper-spinner-lite {
					left: 50%;
					top: 50%;
					position: fixed;
				}
				#home {
					min-height: 50vh;
				}
				app-header {
					background-color: var(--google-blue-700);
					color: var(--paper-grey-50);
				}
				paper-button {
					font-size: 1rem;;
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
				#home {
					min-height: 50vh;
					text-align: center;
				}
			</style>

			<app-location route="{{route}}"></app-location>
			<app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subRoute}}"></app-route>
			<app-route route="{{subRoute}}" pattern="/:pageId" data="{{groupRouteData}}" tail="{{groupSubRoute}}"></app-route>
			<app-route route="{{groupSubRoute}}" pattern="/:product" data="{{productsRouteData}}" tail="{{productsSubRoute}}"></app-route>
			<app-route route="{{productsSubRoute}}" pattern="/:productId" data="{{productRouteData}}" tail="{{productSubRoute}}"></app-route>

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
				</template>
				<template is="dom-if" if="[[_manufacturerActive]]">
					<div id="maufacturer" page-name="maufacturer">
						<fairshop-manufacturer rest-url="[[restUrl]]" route="[[subRoute]]"></fairshop-manufacturer>
					</div>
				</template>
				<template is="dom-if" if="[[_productsActive]]">
					<div id="products" page-name="products">
						<fairshop-products-list rest-url="[[restUrl]]" route="[[subRoute]]"></fairshop-products-list>
					</div>
				</template>
				<template is="dom-if" if="[[_productActive]]">
					<div id="product" page-name="product">
						<fairshop-product rest-url="[[restUrl]]" route="[[subRoute]]"></fairshop-product>
					</div>
				</template>

				<div id="footer">(c) fairshop 2018</div>
			<app-header-layout>
			<paper-toast id="toast"></paper-toast>
		`;
	}

	static get observers() {
		return ['_routePageChanged(route)']
	}

	_routePageChanged(route) {
		console.log('fairshop-app.route.path: ' + this.route.path);
		console.log('fairshop-app.routeData.page: ' + this.routeData.page);
		console.log('fairshop-app.subRoute.path: ' + this.subRoute.path);
		// Hide all views
		this._homeActive = false;
		this._categoriesActive = false;
		this._manufacturersActive = false;
		this._manufacturerActive = false;
		this._productsActive = false;
		this._productActive = false;
		// Activate some views
		if (this.routeData.page == '') {
			this._homeActive = true;
		}
		else if (this.routeData.page == 'categories') {
			if (this.subRoute.path && this.subRoute.path.length && this.groupSubRoute.path && this.groupSubRoute.path.length && this.productRouteData.productId) {
				this._productActive = true;
			}
			else {
				if (this.subRoute.path && this.subRoute.path.length && this.groupRouteData.pageId) {
					this._productsActive = true;
				}
				else {
					this._categoriesActive = true;
				}
			}
		}
		else if (this.routeData.page == 'manufacturers') {
			if (this.subRoute.path && this.subRoute.path.length && this.groupSubRoute.path && this.groupSubRoute.path.length && this.productRouteData.productId) {
				if (this.subRoute.path && this.subRoute.path.length && this.groupRouteData.pageId) {
					this._manufacturerActive = true;
				}
				this._productActive = true;
			}
			else {
				if (this.subRoute.path && this.subRoute.path.length && this.groupRouteData.pageId) {
					this._manufacturerActive = true;
					this._productsActive = true;
				}
				else {
					this._manufacturersActive = true;
				}
			}
		}
	}

}
customElements.define("fairshop-app", FairshopApp);