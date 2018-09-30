import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
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
			count: {
				type: Number,
				value: 0,
				notify: true
			},
			_nettoSum: {
				type: Number,
				value: 0
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
				#backBtn {
					position: absolute;
					right: 1.2rem;
					top: 5rem;
					_background-color: var(--paper-grey-50);
					z-index: 50;
				}
				#shopping,
				#cartTable,
				#cartButtons {
					width: 100%;
					min-height: 3rem;
				}
				#cartButtons {
					margin-top: 2rem;
				}
				.sum {
					font-weight: bold;
					text-align: right;
					margin-right: 3.8rem;
				}
				.item {
					display: flex;
					align-items: center;
					width: 100%;
					border-bottom: solid;
					border-width: .5px;
					border-color: #888;
				}
				.item>div {
					padding: .5rem;
				}
				fairshop-image {
					width: 4rem;
					height: 4rem;
				}
				.item>.image {
					width: 5rem;
					padding: 0 .5rem;
				}
				.prod-id {
					width: 5rem;
				}
				.name {
					flex-grow: 4;
				}
				.count {
					width: 5rem;
					text-align: center;
				}
				.one-price {
					width: 6rem;
					text-align: center;
				}
				.all-netto-price {
					width: 6rem;
					text-align: center;
				}
				.tax {
					width: 5rem;
					text-align: center;
				}
				.all-price {
					width: 5rem;
					text-align: center;
				}
				.remove {
					width: 5rem;
				}
			</style>
			
			<paper-button id="backBtn" aria-label="Go back" on-click="_goBack" raised>Weiter einkaufen</paper-button>

			<h1>Warenkorb</h1>

			<h2>Artikelliste</h2>
			<div class="item">
				<div class="image">&nbsp;</div>
				<div class="prod-id"><h3>ID</h3></div>
				<div class="name"><h3>Name</h3></div>
				<div class="count"><h3>Anzahl</h3></div>
				<div class="one-price"><h3>Einzel Netto</h3></div>
				<div class="all-netto-price"><h3>Netto</h3></div>
				<div class="tax"><h3>MwSt.</h3></div>
				<div class="all-price"><h3>Brutto</h3></div>
				<div class="remove">&nbsp;</div>
			</div>
			<div id="cartTable">
				<!-- Items go here -->
			</div>
			<div class="item">
				<div class="image">&nbsp;</div>
				<div class="prod-id">&nbsp;</div>
				<div class="name">Artikelzahl: [[count]]</div>
				<div class="count"><h3>Summe</h3></div>
				<div class="one-price"><h3>Netto:</h3></div>
				<div class="all-netto-price"><h3>[[_nettoSum]]€</h3></div>
				<div class="tax"><h3>Brutto:</h3></div>
				<div class="all-price"><h3>[[_sum]]€</h3></div>
				<div class="remove">&nbsp;</div>
			</div>

			<div id="cartButtons">
				<paper-button id="emptyCart" on-click="_empty">Leeren</paper-button>
				<paper-button id="buy" raised>Kaufen</paper-button>
			</div>
		`;
	}

	ready() {
		super.ready();
		if (this.count < 1) {
			this.$.emptyCart.setAttribute('disabled', true);
			this.$.buy.setAttribute('disabled', true);
		}
		var that = this;
		document.addEventListener('cart-event', function(event) {
			that._calculateSum();
		});
	}

	_addItem() {
		this.addItem(Number(this._productId), Number(this.count));
	}

	addItem(id, count, productUrl) {
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
			item.productUrl = productUrl;
			item.count = count;
			target.appendChild(item);
		}
		else {
			item.count = Number(item.count) + count;
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
		var nettoSum = 0;
		var sum = 0;
		var target = this.$.cartTable;
		var count = 0;
		for (let cadidate of Array.from(target.children)) {
			var allNettoPrice = Number(cadidate.allNettoPrice);
			var allPrice = Number(cadidate.allPrice);
			if (!isNaN(allPrice)) {
				nettoSum += allNettoPrice;
				sum += allPrice;
			}
			++count;
		}
		this._nettoSum = nettoSum.toFixed(2);
		this._sum = sum.toFixed(2);
		this.count = count;
		if (this.count < 1) {
			this.$.emptyCart.setAttribute('disabled', true);
			this.$.buy.setAttribute('disabled', true);
		}
		else {
			this.$.emptyCart.removeAttribute('disabled');
			this.$.buy.removeAttribute('disabled');
		}
	}

	_goBack() {
		window.history.back();
	}

}
customElements.define("fairshop-cart", FairshopCart);
