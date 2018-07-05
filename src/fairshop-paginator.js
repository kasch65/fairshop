import { PolymerElement, html } from "@polymer/polymer/polymer-element";

/**
 * @class
 */
export class FairshopPaginator extends PolymerElement {
	static get properties() {
		return {
			productIds: {
				type: Array,
				observer: "_productIdsChanged"
			},
			itemIdList: {
				type: String,
				notify: true
			},
			itemsPerPage: {
				type: Number,
				value: 50
			},
			_pages: {
				type: Number
			},
			_page: {
				type: Number,
				value: 0
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
			<style>
				.active {
					background-color: var(--google-blue-100);
				}
				.paginator>div {
					padding: 0.5rem;
					border-style: solid;
					border-width: 0.5px;
					border-color: var(--google-grey-300);
					float: left;
				}
			</style>
			<div class="paginator">
				<div page="prev" on-click="_navigate">prev</div>
				<template is="dom-repeat" items="[[_pageButtons]]" as="pageButton">
					<div page$="[[pageButton]]" on-click="_navigate">[[pageButton]]</div>
				</template>
				<div page="next" on-click="_navigate">next</div>
			</div>
		`;
	}

	_productIdsChanged() {
		this._page = 0;
		this._pages = Math.max(1, Math.ceil(this.productIds.length / this.itemsPerPage));
		var subArray = this.productIds.slice(this._page * this.itemsPerPage, this._page * this.itemsPerPage + this.itemsPerPage);
		this.itemIdList = subArray.toString();
		var pageButtons = Array();
		for (var i = 1; i <= this._pages; i++) {
			pageButtons.push(i);
		}
		this._pageButtons = pageButtons;
	}

	_navigate(ev) {
		if (this._activeButton) {
			this._activeButton.classList.remove("active");
		}
		var target = ev.target;
		while (target && !target.attributes.page) {
			target = target.parentElement;
		}
		this._activeButton = target;
		target.classList.add("active");
		var page = target.attributes.page.value;
		if (page == 'prev') {
			this._page = Math.max(0, this._page - 1);
		}
		else if (page == 'next') {
			this._page = Math.min(this._pages - 1, this._page + 1);
		}
		else {
			this._page = page - 1;
		}
		console.log(this._page);
		var subArray = this.productIds.slice(this._page * this.itemsPerPage, this._page * this.itemsPerPage + this.itemsPerPage);
		this.itemIdList = subArray.toString();
	}

}
customElements.define("fairshop-paginator", FairshopPaginator);
