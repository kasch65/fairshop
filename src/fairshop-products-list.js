import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import './fairshop-paginator.js';
import './fairshop-product-card.js';
import './fairshop-styles.js';
import './services/zencart/fairshop-products-list-service.js';


/**
 * @class
 */
export class FairshopProductsList extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			selectedManufacturer: {
				type: Number
			},
			selectedCategory: {
				type: Number,
				observer: '_categoryChanged'
			},
			searchString: {
				type: String,
				observer: '_searchStringChanged'
			},
			hrefPrefix: {
				tape: String
			},
			_productList: {
				type: Array
			},
			page: {
				type: Number,
				value: 1,
				notify: true
			},
			_itemsPerPage: {
				type: Number,
				value: 42
			},
			_sortOrder: {
				type: String,
				value: 'sum,desc'
			}
		};
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html`
			<style include="fairshop-styles">
				#backBtn {
					position: absolute;
					right: 1.2rem;
					top: 4rem;
					z-index: 50;
				}
				.products {
					_overflow: hidden;
				}
				.active {
					background-color: var(--google-blue-100);
				}
				.products>list {
					_overflow: auto;
				}
				ul {
					/*display: flex;
					flex-wrap: wrap;
					justify-content: flex-start;*/
					width: 100%;
					display: grid;
					grid-gap: .2rem;
					grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
					margin: 0;
					padding: 0;
					list-style-type: none;
				}
				li {
					box-sizing: border-box;
					/*flex-grow: 1;
					width: 12rem;
					max-width: 50%;*/
					padding: 0.2rem;
				}
				li>a {
					text-decoration: none;
				}
				.sorting {
					float: left;
					margin-top: -1rem;
					margin-right: 2rem;
				}
				fairshop-paginator {
					display: inline-block;
				}
			</style>
			<fairshop-products-list-service id="productsListService" rest-url="[[restUrl]]" image-url="[[imageUrl]]" selected-manufacturer="[[selectedManufacturer]]" selected-category="[[selectedCategory]]" search-string="[[searchString]]" page="[[page]]" items-per-page="[[itemsPerPage]]" sort-order="[[_sortOrder]]" product-list="{{_productList}}"></fairshop-products-list-service>
			<div class="products">
				<paper-icon-button id="backBtn" icon="arrow-back" aria-label="Go back" on-click="_goBack"></paper-icon-button>
				<div class="heading"><h1>[[_productList.title]]</h1></div>
				<template is="dom-if" if="[[searchString]]">
					<div class="filtered">Filter: <b>[[searchString]]</b></div>
				</template>
				<template is="dom-if" if="[[_productList.productCnt]]">
					<div class="sorting">
						<paper-dropdown-menu label="Sortierung">
							<paper-listbox slot="dropdown-content" selected="{{_sortOrder}}" attr-for-selected="value">
								<paper-item value="sum,desc">Relevanz</paper-item>
								<paper-item value="price">Preis aufsteigend</paper-item>
								<paper-item value="price,desc">Preis absteigend</paper-item>
								<paper-item value="name">Name</paper-item>
								<paper-item value="available,desc">Verfügbarkeit</paper-item>
							</paper-listbox>
						</paper-dropdown-menu>
					</div>
					<fairshop-paginator page="{{page}}" product-cnt="[[_productList.productCnt]]" items-per-page="{{_itemsPerPage}}"></fairshop-paginator>
				</template>
				<div class="list">
					<ul id="productsList">
						<template is="dom-repeat" items="[[_productList.products]]" as="product">
							<li>
								<a href="[[hrefPrefix]]/[[product.id]]">
									<fairshop-product-card name="[[product.name]]" description="[[product.description]]" image-url="[[product.imageUrl]]" price="[[product.price]]" manufacturer-name="[[product.manufacturerName]]"></fairshop-product-card>
								</a>
							</li>
						</template>
					</ul>
				</div>
			</div>
		`;
	}

	_goBack() {
		window.history.back();
	}

}
customElements.define("fairshop-products-list", FairshopProductsList);
