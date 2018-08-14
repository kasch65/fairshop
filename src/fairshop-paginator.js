import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-slider/paper-slider.js';
import './fairshop-styles.js';

/**
 * @class
 */
export class FairshopPaginator extends PolymerElement {
	static get properties() {
		return {
			productCnt: {
				type: Number,
				observer: "_recalculate"
			},
			itemsPerPage: {
				type: Number,
				value: 42,
				observer: "_recalculate"
			},
			/**
			 * first page is 1
			 */
			page: {
				type: Number,
				value: 1,
				observer: "_pageChanged",
				notify: true
			},
			_pages: {
				type: Number,
				value: 1
			},
			_pageButtons: {
				type: Array
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
				:host paper-button {
					width: 1rem;
				}
				paper-button.active {
					background-color: var(--google-blue-100);
				}
				#paginator>div {
					padding: 0.5rem;
					border-style: solid;
					border-width: 0.5px;
					border-color: var(--google-grey-300);
					float: left;
					cursor: pointer;
				}
			</style>
			<paper-slider value="1" min="1" max="20" pin></paper-slider>
			<div id="paginator">
				<!--<div page="prev" on-click="_navigate">prev</div>-->
				<paper-icon-button icon="icons:chevron-left" on-click="_navigate" page="prev"></paper-icon-button>
				<template is="dom-repeat" items="[[_pageButtons]]" as="pageButton">
					<!--<div class="paginator-page-button" page$="[[pageButton]]" on-click="_navigate">[[pageButton]]</div>-->
					<paper-button on-click="_navigate" page$="[[pageButton]]" raised>[[pageButton]]</paper-button>
				</template>
				<paper-icon-button id="backBtn" icon="icons:chevron-right" on-click="_navigate" page="next"></paper-icon-button>
				<!--<div page="next" on-click="_navigate">next</div>-->
			</div>
		`;
	}

	_recalculate() {
		var pageButtons = Array();
		this._pages = Math.max(1, Math.ceil(this.productCnt / this.itemsPerPage));
		for (var i = 1; i <= this._pages; i++) {
			pageButtons.push(i);
		}
		this._pageButtons = pageButtons;
		this.page = 1;
	}

	_pageChanged(newValue, oldValue) {
		var buttons = this.$.paginator.childNodes;
		for (let button of buttons) {
			if (button.classList) {
				button.classList.remove('active');
				if (button.getAttribute('page') == this.page) {
					button.classList.add('active');
				}
			}
		}
	}

	_navigate(ev) {
		var target = ev.target;
		while (target && !target.attributes.page) {
			target = target.parentElement;
		}
		target.classList.add("active");
		var pageValue = target.attributes.page.value;
		if (pageValue == 'prev') {
			this.page = Math.max(1, this.page - 1);
		}
		else if (pageValue == 'next') {
			this.page = Math.min(this._pages, this.page + 1);
		}
		else {
			this.page = pageValue;
		}
		console.log('Page: ' + this.page);
	}

}
customElements.define("fairshop-paginator", FairshopPaginator);
