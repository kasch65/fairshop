import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import './fairshop-router.js';
import './fairshop-search-field.js';
import './fairshop-manufacturers-list.js';
import './fairshop-manufacturer.js';
import './fairshop-categories-tree.js';
import './fairshop-products-list.js';
import './fairshop-product.js';
import './fairshop-styles.js';

/**
 * @class
 */
export class FairshopApp extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			route: {
				Object
			},
			_page: {
				type: String,
				value: 'home'
			},
			_pageNr: {
				type: Number,
				value: 1,
				notify: true
			},
			_categoryId: {
				type: Number,
				value: null
			},
			_manufacturerId: {
				type: Number,
				value: null
			},
			_productId: {
				type: Number,
				value: null
			},
			_hrefPrefix: {
				type: String
			},
			_path: {
				type: String,
				observer: "_pathChanged"
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
			},
			_searchString: {
				type: String,
				observer: "_searchStringChanged"
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
				fairshop-app {
					background-color: var(--primary-background-color);
				}
				paper-spinner-lite {
					left: 50%;
					top: 50%;
					position: fixed;
				}
				.app-header-layout {
					width: 100vw;
					height: 100vh;
					display: flex;
					flex-direction: column;
					overflow: hidden;
				}
				.app-header {
					box-sizing: border-box;
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					justify-content: space-between;
					padding: 0 .5rem;
					width: 100%;
					_height: 3.625rem;
					left: 0;
					top: 0;
					background-color: var(--google-blue-700);
					color: var(--paper-grey-50);
					box-shadow: 2px 4px 10px rgba(0,0,0,.2);
					z-index: 100;
				}
				[main-title] {
					font-size: 1.5rem;
					color: var(--paper-grey-50);
				}
				.menu {
					display: flex;
					flex-wrap: wrap;
					align-items: center;
				}
				paper-button {
					color: var(--paper-grey-50);
					_font-size: 1rem;;
				}
				.app-header a {
					color: var(--paper-grey-50);
					text-decoration: none;
				}
				.app-body {
					flex: 1;
					display: flex;
					flex-direction: column;
					overflow: auto;
				}
				div[page-name] {
					padding: 1rem;
				}
				#home {
					min-height: 50vh;
					text-align: center;
				}
				#home .featurelist {
					width: fit-content;
					margin: auto;
					text-align: left;
				}
				#footer {
					margin-top: 1rem;
					padding: 1rem;
					background-color: var(--google-blue-700);
					color: var(--paper-grey-50);
					box-shadow: 2px 4px 10px rgba(0,0,0,.2);
				}
			</style>

			<fairshop-router page="{{_page}}" page-nr="{{_pageNr}}" category-id="{{_categoryId}}" manufacturer-id="{{_manufacturerId}}" product-id="{{_productId}}" href-prefix="{{_hrefPrefix}}" path="{{_path}}"></fairshop-router>

			<div class="app-header-layout">
				<div class="app-header">
					<div main-title>fairshop demo</div>
					<div class="menu">
						<div><a href="/"><paper-button>Home</paper-button></a></div>
						<div><a href="/categories"><paper-button>Categories</paper-button></a></div>
						<div><a href="/manufacturers"><paper-button>Manufacturers</paper-button></a></div>
						<div><fairshop-search-field search-string="{{_searchString}}"></fairshop-search-field></div>
					</div>
				</div>

				<div class="app-body">
					<template is="dom-if" if="[[_homeActive]]">
						<div id="home" page-name="home">
							<h1>fairshop</h1>
							<h2>fair and always open</h2>
							<div class="featurelist">
								<ul>
									<li>fastest shop in the world</li>
									<li>easy to customize</li>
									<li>extensible</li>
									<li>reliable</li>
								</ul>
							</div>
						</div>
					</template>
					<template is="dom-if" if="[[_categoriesActive]]">
						<div id="categories" page-name="categories">
							<fairshop-categories-tree rest-url="[[restUrl]]" search-string="[[_searchString]]"></fairshop-categories-tree>
						</div>
					</template>
					<template is="dom-if" if="[[_manufacturersActive]]">
						<div id="manufacturers" page-name="manufacturers">
							<fairshop-manufacturers-list rest-url="[[restUrl]]" image-url="[[imageUrl]]" search-string="[[_searchString]]"></fairshop-manufacturers-list>
						</div>
					</template>
					<template is="dom-if" if="[[_manufacturerActive]]">
						<div id="maufacturer" page-name="maufacturer">
							<fairshop-manufacturer rest-url="[[restUrl]]" image-url="[[imageUrl]]" selected-manufacturer="[[_manufacturerId]]"></fairshop-manufacturer>
						</div>
					</template>
					<template is="dom-if" if="[[_productsActive]]">
						<div id="products" page-name="products">
							<fairshop-products-list rest-url="[[restUrl]]" image-url="[[imageUrl]]" selected-manufacturer="[[_manufacturerId]]" selected-category="[[_categoryId]]" href-prefix="[[_hrefPrefix]]" page="{{_pageNr}}" search-string="[[_searchString]]"></fairshop-products-list>
						</div>
					</template>
					<template is="dom-if" if="[[_productActive]]">
						<div id="product" page-name="product">
							<fairshop-product rest-url="[[restUrl]]" image-url="[[imageUrl]]" selected-product="[[_productId]]"></fairshop-product>
						</div>
					</template>

					<div id="footer">(c) fairshop 2018</div>
					<div>
				<div>
			<paper-toast id="toast"></paper-toast>
		`;
	}

	_pathChanged() {
		// Hide all views
		this._homeActive = false;
		this._categoriesActive = false;
		this._manufacturersActive = false;
		this._manufacturerActive = false;
		this._productsActive = false;
		this._productActive = false;
		// Activate some views
		if (this._searchString && !this._productId && !this._manufacturerId) {
			this._categoriesActive = true;
			this._manufacturersActive = true;
			this._productsActive = true;
		}
		else {
			if (this._page == 'home') {
				this._homeActive = true;
			}
			else if (this._productId) {
				this._productActive = true;
			}
			else if (this._page == 'categories') {
				if (this._categoryId) {
					this._productsActive = true;
				}
				else {
					this._categoriesActive = true;
				}
			}
			else if (this._page == 'manufacturers') {
				if (this._manufacturerId) {
					this._manufacturerActive = true;
					this._productsActive = true;
				}
				else {
					this._manufacturersActive = true;
				}
			}
		}
	}

	_searchStringChanged() {
		if (this._searchString) {
			this._waitForSearch = null;
			this._homeActive = false;
			this._categoriesActive = true;
			this._manufacturersActive = true;
			this._manufacturerActive = false;
			this._productsActive = true;
			this._productActive = false;
		}
		else {
			this._pathChanged();
		}
	}

}
customElements.define("fairshop-app", FairshopApp);