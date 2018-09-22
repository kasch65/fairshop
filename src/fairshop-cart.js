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
					width: 5rem;
					text-align: center;
				}
				.all-netto-price {
					width: 5rem;
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

			<h1>Warenkorb</h1>
			<div id="shopping">
				<paper-input id="productId" label="ID" value="{{_productId}}" always-float-label></paper-input>
				<paper-input id="count" label="Anzahl" value="{{_count}}" always-float-label></paper-input>
				<paper-button on-click="_addItem">Artikel Hinzufügen</paper-button>
			</div>

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
				<div class="name">&nbsp;</div>
				<div class="count"><h3>Summe</h3></div>
				<div class="one-price"><h3>Netto:</h3></div>
				<div class="all-netto-price"><h3>[[_nettoSum]]€</h3></div>
				<div class="tax"><h3>Brutto:</h3></div>
				<div class="all-price"><h3>[[_sum]]€</h3></div>
				<div class="remove">&nbsp;</div>
			</div>

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
		for (let cadidate of Array.from(target.children)) {
			var allNettoPrice = Number(cadidate.allNettoPrice);
			var allPrice = Number(cadidate.allPrice);
			if (!isNaN(allPrice)) {
				nettoSum += allNettoPrice;
				sum += allPrice;
			}
		}
		this._nettoSum = nettoSum.toFixed(2);
		this._sum = sum.toFixed(2);
	}

}
customElements.define("fairshop-cart", FairshopCart);
