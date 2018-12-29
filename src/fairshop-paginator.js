import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
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
				paper-button,
				paper-icon-button {
					width: 2rem;
					min-width: 0;
					height: 2.5rem;
					margin: 0;
					border-style: solid;
					border-width: 0.5px;
					border-color: var(--google-grey-300);
				}
				paper-button.active,
				paper-button:hover,
				paper-icon-button:hover {
					//background-color: var(--google-blue-100);
					box-shadow: 2px 4px 10px rgba(0,0,0,.2);
				}
				#prev,
				#next,
				.page-button {
					float: left;
				}
				paper-icon-button[disabled] {
					opacity: .5;
				}
			</style>
			<div id="paginator">
				<paper-icon-button id="prev" aria-label="previous" icon="icons:chevron-left" on-click="_prev"></paper-icon-button>
				<span id="pageButtons"><!-- Generated buttons go here --></span>
				<paper-icon-button id="next" aria-label="next" icon="icons:chevron-right" on-click="_next"></paper-icon-button>
			</div>
		`;
	}

	_recalculate() {
		this._pages = Math.max(1, Math.ceil(this.productCnt / this.itemsPerPage));
		var target = this.$.pageButtons;
		var firstButton = true;
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}
		// Create page buttons
		for (var i = 1; i <= this._pages; i++) {
			var pageButton = document.createElement('paper-button');
			pageButton.classList.add('page-button');
			if (firstButton) {
				pageButton.classList.add('active');
				firstButton = false;
			}
			pageButton.addEventListener('click', ev => this._navigate(ev));
			pageButton.page = i;
			pageButton.innerHTML = i;
			target.appendChild(pageButton);
		}
		this.page = 1;
	}

	_pageChanged(newValue, oldValue) {
		var buttons = this.$.pageButtons.childNodes;
		for (let button of buttons) {
			if (button.classList) {
				if (button.page == this.page) {
					button.classList.add('active');
				}
				else {
					button.classList.remove('active');
				}
			}
		}
		if (this.page == 1) {
			var buttons = this.$.prev.setAttribute('disabled', true);
		}
		else {
			var buttons = this.$.prev.removeAttribute('disabled');
		}
		if (this.page == this._pages) {
			var buttons = this.$.next.setAttribute('disabled', true);
		}
		else {
			var buttons = this.$.next.removeAttribute('disabled');
		}
	}

	_navigate(ev) {
		var target = ev.target;
		if (target && target.page) {
			this.page = target.page;
			console.log('Page: ' + this.page);
		}
	}

	_prev(ev) {
		this.page = Math.max(1, this.page - 1);
		console.log('Page: ' + this.page);
	}

	_next(ev) {
		this.page = Math.min(this._pages, this.page + 1);
		console.log('Page: ' + this.page);
	}

}
customElements.define("fairshop-paginator", FairshopPaginator);
