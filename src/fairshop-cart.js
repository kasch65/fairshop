import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import './fairshop-cart-item.js';
import './fairshop-styles.js';

/**
 * @class
 */
export class FairshopCart extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			_productId: {
				type: Number,
				value: 1814
			},
			_count: {
				type: Number,
				value: 1
			},
			_sum: {
				type: Number,
				value: 0
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
			#shopping,
			#cartTable,
			#cartButtons {
				width: 100%;
				min-height: 3rem;
			}
				#shopping paper-input,
				#shopping paper-button {
					float: left;
					width: 12rem;
					margin-right: 0.5rem;
				}
			</style>

			<h1>Warenkorb</h1>
			<div id="shopping">
				<paper-input id="productId" label="ID" value="{{_productId}}" always-float-label></paper-input>
				<paper-input id="count" label="Anzahl" value="{{_count}}" always-float-label></paper-input>
				<paper-button on-click="_addItem">Artikel Hinzufügen</paper-button>
			</div>

			<h2>Artikelliste</h2>
			<div id="cartTable">
				<!-- Items go here -->
			</div>
			Summe: [[_sum]]

			<div id="cartButtons">
				<paper-button on-click="_empty">Leeren</paper-button>
				<paper-button>Kaufen</paper-button>
			</div>
		`;
	}

	ready() {
		super.ready();
		var that = this;
		document.addEventListener('cart-event', function(event) {
			that._calculateSum();
		});
	}

	_addItem() {
		this.addItem(Number(this._productId), Number(this._count));
	}

	addItem(id, count) {
		var target = this.$.cartTable;
		var item = null;
		for (let cadidate of Array.from(target.children)) {
			if (cadidate.productId == id) {
				item = cadidate;
				break;
			}
		}
		if (!item) {
			// Create item
			var item = document.createElement('fairshop-cart-item');
			item.restUrl = this.restUrl;
			item.imageUrl = this.imageUrl;
			item.productId = id;
			item.count = count;
			target.appendChild(item);
		}
		else {
			item.count += Number(count);
		}
	}

	_empty() {
		var target = this.$.cartTable;
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}
		this._calculateSum();
	}

	_calculateSum() {
		var sum = 0;
		var target = this.$.cartTable;
		for (let cadidate of Array.from(target.children)) {
			var allPrice = Number(cadidate.allPrice);
			if (!isNaN(allPrice)) {
				sum += allPrice;
			}
		}
		this._sum = sum.toFixed(2);
	}

}
customElements.define("fairshop-cart", FairshopCart);
