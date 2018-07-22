import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-input/iron-input.js';

/**
 * @class
 */
export class FairshopSearchField extends PolymerElement {
	static get properties() {
		return {
			searchString: {
				type: String,
				notify: true
			},
			_searchInput: {
				type: String,
				observer: "_searchInputChanged"
			},
			searchString: {
				type: String,
				notify: true
			},
			_waitForSearch: {
				type: Object
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
				iron-input {
					border: none;
					border-width: 0;
				}
				#resetSearch {
					transition: width .2s;
				}
				iron-input input.hidden,
				#resetSearch.hidden {
					width: 0;
					padding: 0.5rem 0;
				}
				iron-input input {
					height: 1.3rem;
					width: 9rem;
					padding: 0.5rem;
					border-style: none none solid none;
					border-width: 0 0 2px 0;
					border-radius: .2rem .2rem 0 0;
					border-color: #8884;
					background-color: #fffd;
					transition: width .2s;
				}
			</style>
			<iron-input bind-value="{{_searchInput}}">
				<input id="searchField" class="hidden">
			</iron-input>
			<paper-icon-button id="resetSearch" class="hidden" icon="icons:clear" on-click="_resetSearch"></paper-icon-button>
			<paper-icon-button class="search" icon="icons:search" on-click="_toggleSearch"></paper-icon-button>
		`;
	}

	_searchInputChanged() {
		if (this._searchInput && this._searchInput.length == 3) {
			this.searchString = this._searchInput;
		}
		else if (this._searchInput && this._searchInput.length > 3) {
			if (!this._waitForSearch) {
				var self = this;
				this._waitForSearch = setTimeout(function() {
					self.searchString = self._searchInput;
				}, 1000);
			}
		}
		else {
			if (this._waitForSearch) {
				clearTimeout(this._waitForSearch);
				this._waitForSearch = null;
			}
			this.searchString = null;
		}
	}

	_toggleSearch() {
		this.$.searchField.classList.toggle('hidden');
		if (!this.$.searchField.classList.contains('hidden')) {
			this.$.searchField.focus();
		}
		else {
			this._resetSearch();
		}
		this.$.resetSearch.classList.toggle('hidden');
	}

	_resetSearch() {
		if (this._waitForSearch) {
			clearTimeout(this._waitForSearch);
			this._waitForSearch = null;
		}
		this._searchInput = null;
	}

}
customElements.define("fairshop-search-field", FairshopSearchField);
