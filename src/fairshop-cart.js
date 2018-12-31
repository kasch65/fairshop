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
			toast: {
				type: Object
			},
			unauthorized: {
				type: Boolean,
				notify: true
			},
			csrf: {
				type: String
			},
			session: {
				type: Object
			},
			_cart: {
				type: Object,
				observer: '_calculateSum'
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
				.discount {
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

			<fairshop-cart-service id="cartService" rest-url="[[restUrl]]" toast="[[toast]]" session="[[session]]" unauthorized="{{unauthorized}}" csrf="{{csrf}}" image-url="[[imageUrl]]" cart="{{_cart}}"></fairshop-cart-service>
			
			<paper-button id="backBtn" aria-label="Go back" on-click="_goBack" raised>Weiter einkaufen</paper-button>

			<h1>Warenkorb</h1>

			<h2>Artikelliste</h2>
			<!-- Table header -->
			<div class="item">
				<div class="image">&nbsp;</div>
				<div class="prod-id"><h3>ID</h3></div>
				<div class="name"><h3>Name</h3></div>
				<div class="count"><h3>Anzahl</h3></div>
				<div class="one-price"><h3>UVP</h3></div>
				<div class="discount"><h3>Rabatt</h3></div>
				<div class="all-netto-price"><h3>Netto</h3></div>
				<div class="tax"><h3>MwSt.</h3></div>
				<div class="all-price"><h3>Brutto</h3></div>
				<div class="remove">&nbsp;</div>
			</div>
			<div id="cartTable">
				<!-- Items go here -->
				<template is="dom-repeat" items="[[_cart.items]]" as="item">
					<fairshop-cart-item rest-url="[[restUrl]]" image-url="[[imageUrl]]" cart="{{_cart}}" item="{{item}}"></fairshop-cart-item>
				</template>
			</div>
			<!-- Table footer -->
			<div class="item">
				<div class="image">&nbsp;</div>
				<div class="prod-id">&nbsp;</div>
				<div class="name">Artikelzahl: [[_cart.count]]</div>
				<div class="count"><h3>Summe</h3></div>
				<div class="one-price"><h3>Netto:</h3></div>
				<div class="discount"></div>
				<div class="all-netto-price"><h3>[[_cart.nettoSum]]€</h3></div>
				<div class="tax"><h3>Brutto:</h3></div>
				<div class="all-price"><h3>[[_cart.sum]]€</h3></div>
				<div class="remove">&nbsp;</div>
			</div>

			<div id="cartButtons">
				<paper-button id="emptyCart" on-click="_empty">Leeren</paper-button>
				<paper-button id="buy" on-click="_checkout" raised>Kaufen</paper-button>
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

	static get observers() {
		return ['_calculateSum(_cart.items.splices)']
	}

	setItem(id, count, productUrl) {
		//console.log('fairshop-cart.js.setItem(): Adding ' + count + ' pcs. to item ' + id + '.');
		var cartService = this.$.cartService;
		cartService.setItem(id, count, productUrl);
		this.toast.text = 'Artikel in den Warenkorb gelegt: id = ' + id + ', Anzahl = ' + count + '';
		this.toast.open();
	}

	_empty() {
		this.set('_cart.items', new Array());
	}

	_calculateSum() {
		//console.log('fairshop-cart.js._calculateSum()');
		if (!this._cart) {
			return;
		}
		var nettoSum = 0;
		var sum = 0;
		var count = 0;
		for (let item of this._cart.items) {
			var allNettoPrice = Number(item.allNettoPrice);
			var allPrice = Number(item.allPrice);
			if (!isNaN(allPrice)) {
				nettoSum += allNettoPrice;
				sum += allPrice;
			}
			count = Number(count) + Number(item.count);
		}
		// Format currency
		this.set('_cart.nettoSum', nettoSum.toFixed(2));
		this.set('_cart.sum', sum.toFixed(2));
		this.set('_cart.count', count);

		// Enable buttons
		if (this._cart.count < 1) {
			this.$.emptyCart.setAttribute('disabled', true);
			this.$.buy.setAttribute('disabled', true);
		}
		else {
			this.$.emptyCart.removeAttribute('disabled');
			this.$.buy.removeAttribute('disabled');
		}
		// Publish count
		this.count = this._cart.count;
	}

	_goBack() {
		window.history.back();
	}

	_checkout() {
		this.$.cartService.checkout();
	}
}
customElements.define("fairshop-cart", FairshopCart);
