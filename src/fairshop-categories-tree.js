import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './fairshop-styles.js';
import './services/bukhtest/fairshop-categories-tree-service.js';

/**
 * @class
 */
export class FairshopCategoriesTree extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			searchString: {
				type: String
			},
			_searchMatches: {
				type: Set,
				observer: '_search'
			},
			_categoriesTree: {
				type: Array,
				observer: '_renderTree'
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
				.categories {
					overflow: auto;
				}
				.active {
					background-color: var(--google-blue-100);
				}
				.cat-node {
					margin-left: 1rem;
				}
				.cat-node a {
					text-decoration: none;
					color: var(--secondary-text-color);
				}
				#catList>.cat-node {
					float:	left;
					color: var(--secondary-text-color);
					padding: 0.5rem;
					margin: 0.5rem;
					border-style: solid;
					border-width: 0.5px;
					border-color: var(--google-grey-300);
				}
				.found {
					background-color: yellow;
				}
			</style>
			<fairshop-categories-tree-service id="categoriesTreeService" rest-url="[[restUrl]]" search-string="[[searchString]]" search-matches="{{_searchMatches}}" categories-tree="{{_categoriesTree}}"></fairshop-categories-tree-service>
			<div class="categories">
				<h1>Kategoriebaum</h1>
				<template is="dom-if" if="[[searchString]]">
					<div class="filtered">Filter: <b>[[searchString]]</b></div>
				</template>
				<div id="catList">
					<!-- Categories go here -->
				</div>
			</div>
		`;
	}

	_search() {
		this._resetSearch();
		if (this._searchMatches) {
			var catDivs = this.root.querySelectorAll('.cat-node');
			for (let catDiv of catDivs) {
				if (this._searchMatches.has(Number(catDiv.getAttribute('category')))) {
					catDiv.classList.add('found');
				}
			}
		}
	}

	_resetSearch() {
		var catDivs = this.root.querySelectorAll('.cat-node');
		for (let catDiv of catDivs) {
			catDiv.classList.remove('found');
		}
	}

	_renderTree() {
		for (let category of this._categoriesTree) {
			this._renderCategory(0, category, this.$.catList);
		}
	}

	_renderCategory(level, category, parentElement) {
		var catElement = document.createElement('div');
		var aElement = document.createElement('a');
		aElement.setAttribute("href", category.url);
		var catTextElement = document.createTextNode(category.name);
		aElement.appendChild(catTextElement);
		catElement.appendChild(aElement);
		catElement.setAttribute("class", "cat-node");
		//catElement.setAttribute("href", category[0]);
		catElement.setAttribute("category", category.id);
		parentElement.appendChild(catElement);
		if (category.children) {
			for (let child of category.children) {
				this._renderCategory(level + 1, child, catElement);
			}
		}
	}

}
customElements.define("fairshop-categories-tree", FairshopCategoriesTree);
