import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';

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
					color: var(--google-grey-700);
				}
				#catList>.cat-node {
					float:	left;
					color: var(--google-grey-700);
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
			<div class="categories">
				<h1>Kategoriebaum</h1>
				<template is="dom-if" if="[[searchString]]">
					<div class="filtered">Filter: <b>[[searchString]]</b></div>
				</template>
				<div id="catList">
			</div>

			<iron-ajax 
				id="requestCategoryDescriptions"
				url="[[restUrl]]category_descriptions?columns=categoryId,parentId,name"
				handle-as="json"
				on-response="_categoryDescriptionsReceived">
			</iron-ajax>

			<iron-ajax 
				id="searchCategoryDescriptions"
				handle-as="json"
				on-response="_searchDescriptionsReceived">
			</iron-ajax>
		`;
	}

	ready() {
		super.ready();
		this.$.requestCategoryDescriptions.generateRequest();
	}

	_categoryDescriptionsReceived(data) {
		if (data.detail.response && data.detail.response.category_descriptions) {
			var categoryRecords = data.detail.response.category_descriptions.records;
			var parentCategoryId = null;
			var indent = 0;
			var target = this.$.catList;
			this.addChildren(parentCategoryId, categoryRecords, target, indent);
			// Let tests wait until ajax data has been evaluated and this event to be fired
			this.dispatchEvent(new CustomEvent('test-event', {detail: 'ajax-loaded'}));
		}
	}

	addChildren(parentCategoryId, categoryRecords, target, indent) {
		for (let category of categoryRecords) {
			if (category[1] == parentCategoryId) {
				//console.log('' + indent + ' ' + category[0] + ' ' + category[2]);
				var catElement = document.createElement('div');
				var aElement = document.createElement('a');
				aElement.setAttribute("href", "/categories/" + category[0]);
				var catTextElement = document.createTextNode(category[2]);
				aElement.appendChild(catTextElement);
				catElement.appendChild(aElement);
				catElement.setAttribute("class", "cat-node");
				//catElement.setAttribute("href", category[0]);
				catElement.setAttribute("category", category[0]);
				target.appendChild(catElement);
				this.addChildren(category[0], categoryRecords, catElement, indent + 1);
			}
		}
	}

	_search() {
		if (this.searchString) {
			console.log('Highlighting categories: ' + this.searchString);
			this.$.searchCategoryDescriptions.url = this.restUrl + 'category_descriptions?filter[]=name,cs,' + this.searchString + '&filter[]=description,cs,' + this.searchString + '&satisfy=any&columns=categoryId';
			this.$.searchCategoryDescriptions.generateRequest();
		}
		else {
			this._resetSearch();
		}
	}

	_searchDescriptionsReceived(data) {
		if (data.detail.response && data.detail.response.category_descriptions) {
			this._resetSearch();
			var catDivs = this.root.querySelectorAll('.cat-node');
			for (let catIdRes of data.detail.response.category_descriptions.records) {
				var catId = catIdRes[0];
				for (let catDiv of catDivs) {
					if (catDiv.getAttribute('category') == catId) {
						catDiv.classList.add('found');
					}
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

}
customElements.define("fairshop-categories-tree", FairshopCategoriesTree);
