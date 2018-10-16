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
			},
			_id: {
				type: Number
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
				<paper-button id="buy" on-click="_checkout" raised>Kaufen</paper-button>
			</div>

			<iron-ajax 
				id="requestCheckout"
				url="[[restUrl]]orders?csrf=[[csrf]]"
				with-credentials="true"
				method="post"
				handle-as="json"
				content-type="application/json"
				on-response="_checkoutReceived"
				on-error="_checkoutFailure">
			</iron-ajax>

			<iron-ajax 
				id="requestCheckoutItem"
				url="[[restUrl]]order_items?csrf=[[csrf]]"
				with-credentials="true"
				method="post"
				handle-as="json"
				content-type="application/json"
				on-error="_checkoutItemFailure">
			</iron-ajax>
		`;
	}

	ready() {
		super.ready();
		if (this.count < 1) {
			this.$.emptyCart.setAttribute('_', true);
			this.$.buy.setAttribute('_disabled', true);
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
		if (!this._id || !(Number(this._id) > 0)) {
			this._id = Number(new Date().getTime());
		}
		this.toast.text = 'Artikel in den Warenkorb gelegt: id = ' + id + ', Anzahl = ' + count + '';
		this.toast.open();
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
			this.$.buy.removeAttribute('_disabled');
		}
	}

	_goBack() {
		window.history.back();
	}

	_checkout() {
		var checkout = new Object();
		checkout.id = Number(this._id);
		// TODO Security risk: user must be set by server!
		if (this.session) {
			checkout.user = this.session.user;
		}
		this.$.requestCheckout.body = checkout;
		this.$.requestCheckout.generateRequest();
	}

	/**
	 * Called when cart has been crated on server
	 * @param {*} data 
	 */
	_checkoutReceived(data) {
		var target = this.$.cartTable;
		var requests = Array();
		for (let cadidate of Array.from(target.children)) {
			var checkoutItem = new Object();
			checkoutItem.orderId = Number(this._id);
			checkoutItem.productId = Number(cadidate.productId);
			checkoutItem.count = Number(cadidate.count);
			this.$.requestCheckoutItem.body = checkoutItem;
			var request = this.$.requestCheckoutItem.generateRequest();
			request.setAttribute('productId', checkoutItem.productId);
			requests.push(request);
		}
		var that = this;
		Promise.all(requests).then(function (requests) {
			for (let request of requests) {
				for (let cadidate of Array.from(target.children)) {
					var productIdRunner = Number(cadidate.productId);
					if (productIdRunner == request.getAttribute('productId')) {
						cadidate.parentElement.removeChild(cadidate);
					}
				}
			}
			that._calculateSum();
			that.toast.text = 'Bestellung erfolgreich abgeschlossen.';
			that.toast.open();
		});
	}

	_checkoutFailure(event) {
		if (event.detail.request.status == "401") {
			console.log('Not authenticated!');
			this.toast.text = 'Not authenticated!';
			this.toast.open();
			this.unauthorized = true;
		} else if (event.detail.request.status == "403") {
			console.log('Not permitted!');
			this.toast.text = 'Not permitted!';
			this.toast.open();
			this.unauthorized = true;
		}
	}

	_checkoutItemFailure(event) {
		// Invalidate old cart id
		this._id = Number(new Date().getTime());
		this.toast.text = 'Bestellung fehlgeschlegen. Bitte versuchen Sie es später erneut.';
		this.toast.open();
	}

}
customElements.define("fairshop-cart", FairshopCart);
