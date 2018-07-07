import { PolymerElement, html } from "../node_modules/@polymer/polymer/polymer-element.js";
/**
 * @class
 */

export class FairshopCategoriesTree extends PolymerElement {
  static get properties() {
    return {
      restUrl: {
        type: String
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
			</style>
			<div class="categories">
				<h1>Kategoriebaum</h1>
				<div id="catList">
			</div>

			<iron-ajax 
				id="requestCategoryDescriptions"
				url="[[restUrl]]category_descriptions?columns=categoryId,parentId,name"
				handle-as="json"
				on-response="_categoryDescriptionsReceived">
			</iron-ajax>
		`;
  }

  ready() {
    super.ready();
    this.$.requestCategoryDescriptions.generateRequest();
  }

  _categoryDescriptionsReceived(data) {
    var categoryRecords = data.detail.response.category_descriptions.records;
    var parentCategoryId = null;
    var indent = 0;
    var target = this.$.catList;
    this.addChildren(parentCategoryId, categoryRecords, target, indent);
  }

  addChildren(parentCategoryId, categoryRecords, target, indent) {
    for (let category of categoryRecords) {
      if (category[1] == parentCategoryId) {
        console.log('' + indent + ' ' + category[0] + ' ' + category[2]);
        var catElement = document.createElement('div');
        var aElement = document.createElement('a');
        aElement.setAttribute("href", "/categories/" + category[0]);
        var catTextElement = document.createTextNode(category[2]);
        aElement.appendChild(catTextElement);
        catElement.appendChild(aElement);
        catElement.setAttribute("class", "cat-node");
        catElement.setAttribute("href", category[0]);
        target.appendChild(catElement);
        this.addChildren(category[0], categoryRecords, catElement, indent + 1);
      }
    }
  }

}
customElements.define("fairshop-categories-tree", FairshopCategoriesTree);