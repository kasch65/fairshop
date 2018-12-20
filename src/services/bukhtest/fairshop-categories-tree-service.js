import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';

/**
 * @class
 */
export class FairshopCategoriesTreeService extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			searchString: {
				type: String,
				observer: '_search'
			},
			_categoriesMap: {
				type: Map,
				value: new Map()
			},
			categoriesTree: {
				type: Array,
				notify: true
			},
			searchMatches: {
				type: Set,
				notify: true
			}
		};
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html `
			<iron-ajax 
				id="requestCategoryDescriptions"
				url="[[restUrl]]category_descriptions?columns=categoryId,parentId,name&order[]=pos&order[]=name"
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
			this._categoriesMap.clear();
			// Store all categories in a map
			var categoryRecords = data.detail.response.category_descriptions.records;
			for (let category of categoryRecords) {
				var newCategory = {
					'id': Number(category[0]),
					'parentId': Number(category[1]),
					'url': '/categories/' + category[0],
					'name': category[2],
					'children': null
				}
				this._categoriesMap.set(Number(category[0]), newCategory);
			}
			// Assign to children
			var obsoleteParents = new Array();
			for (var possibleChild of this._categoriesMap.values()) {
				var parentCategory = this._categoriesMap.get(Number(possibleChild.parentId));
				if (parentCategory) {
					this._addChild(parentCategory, possibleChild);
					obsoleteParents.push(possibleChild.id);
				}
			}
			// Remove categories from mat that are children
			for (var obsoleteParent of obsoleteParents) {
				this._categoriesMap.delete(obsoleteParent);
			}
			// Create a new array with root categories as result
			var newCategories = Array();
			for (var value of this._categoriesMap.values()) {
				newCategories.push(value);
			}
			// Assign result
			this.categoriesTree = newCategories;
			// Let tests wait until ajax data has been evaluated and this event to be fired
			this.dispatchEvent(new CustomEvent('test-event', {detail: 'ajax-loaded'}));
		}
	}

	_search() {
		if (this.searchString) {
			console.log('Highlighting categories: ' + this.searchString);
			this.$.searchCategoryDescriptions.url = this.restUrl + 'category_descriptions?filter[]=name,cs,' + this.searchString + '&filter[]=description,cs,' + this.searchString + '&satisfy=any&columns=categoryId';
			this.$.searchCategoryDescriptions.generateRequest();
		}
		else {
			this.searchMatches = null;
		}
	}

	_searchDescriptionsReceived(data) {
		if (data.detail.response && data.detail.response.category_descriptions) {
			var newMatches = new Set();
			var catDivs = this.root.querySelectorAll('.cat-node');
			for (let catIdRes of data.detail.response.category_descriptions.records) {
				var catId = Number(catIdRes[0]);
				newMatches.add(catId);
			}
			this.searchMatches = newMatches;
		}
	}

	_addChild(parent, child) {
		var children = parent.children;
		if (!children) {
			children = new Array();
			parent.children = children;
		}
		children.push(child);
	}

}
customElements.define("fairshop-categories-tree-service", FairshopCategoriesTreeService);
