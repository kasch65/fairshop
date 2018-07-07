import { PolymerElement, html } from "../node_modules/@polymer/polymer/polymer-element.js";
import "../node_modules/@polymer/app-layout/app-layout.js";
import "../node_modules/@polymer/iron-pages/iron-pages.js";
import "../node_modules/@polymer/iron-input/iron-input.js";
import "../node_modules/@polymer/paper-toast/paper-toast.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/paper-spinner/paper-spinner-lite.js";
import './fairshop-router.js';
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
      _page: {
        type: String,
        value: 'home'
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

			<fairshop-router page="{{_page}}" category-id="{{_categoryId}}" manufacturer-id="{{_manufacturerId}}" product-id="{{_productId}}" href-prefix="{{_hrefPrefix}}" path="{{_path}}"></fairshop-router>

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
						<fairshop-manufacturer rest-url="[[restUrl]]" selected-manufacturer="[[_manufacturerId]]"></fairshop-manufacturer>
					</div>
				</template>
				<template is="dom-if" if="[[_productsActive]]">
					<div id="products" page-name="products">
						<fairshop-products-list rest-url="[[restUrl]]" selected-manufacturer="[[_manufacturerId]]" selected-category="[[_categoryId]]" href-prefix="[[_hrefPrefix]]"></fairshop-products-list>
					</div>
				</template>
				<template is="dom-if" if="[[_productActive]]">
					<div id="product" page-name="product">
						<fairshop-product rest-url="[[restUrl]]" selected-product="[[_productId]]"></fairshop-product>
					</div>
				</template>

				<div id="footer">(c) fairshop 2018</div>
			<app-header-layout>
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
    this._productActive = false; // Activate some views

    if (this._page == 'home') {
      this._homeActive = true;
    } else if (this._productId) {
      this._productActive = true;
    } else if (this._page == 'categories') {
      if (this._categoryId) {
        this._productsActive = true;
      } else {
        this._categoriesActive = true;
      }
    } else if (this._page == 'manufacturers') {
      if (this._manufacturerId) {
        this._manufacturerActive = true;
        this._productsActive = true;
      } else {
        this._manufacturersActive = true;
      }
    }
  }

}
customElements.define("fairshop-app", FairshopApp);