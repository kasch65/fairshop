import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import './fairshop-styles.js';

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
			<style include="fairshop-styles">
				.search-field {
					display: flex;
					align-items: center;
				}
				paper-input {
					overflow: hidden;
					--paper-input-container-color: var(--paper-grey-50);
					--paper-input-container-focus-color: #ddd;
					--paper-input-container-invalid-color: red;
					--paper-input-container-input-color: var(--paper-grey-50);
					transition: width 2s;
				}
				paper-input.hidden {
					width: 0;
				}
				paper-icon-button {
					background-color: var(--google-blue-700);
					color: var(--paper-grey-50);
				}
			</style>
			<div class="search-field">
				<paper-input id="searchField" class="hidden" label="Suche" value="{{_searchInput}}" no-label-float>
					<paper-icon-button id="resetSearch" aria-label="reset search" slot="suffix" icon="icons:clear" on-click="_resetSearch"></paper-icon-button>
				</paper-input>
				<paper-icon-button id="searchButton" aria-label="search" class="search" icon="icons:search" on-click="_toggleSearch"></paper-icon-button>
				<paper-tooltip for="searchButton">Suche einblenden</paper-tooltip>
			</div>
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
