import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import {FairshopCartItemService} from './fairshop-cart-item-service.js';

/**
 * @class
 */
export class FairshopCartService extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
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
			cart: {
				type: Object,
				notify: true
			}
		};
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html `
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
		this.newCart();
	}

	newCart() {
		this.cart = {
			'id': Number(new Date().getTime()),
			'count': 0,
			'nettoSum': 0,
			'sum': 0,
			'items': new Array()
		};
	}

	/**
	 * Extend items with values from rest service and calculate values
	 * or just alter count
	 * @param {*} id 
	 * @param {*} count 
	 * @param {*} productUrl 
	 */
	setItem(id, count, productUrl) {
		var item = null;
		var pos = 0;
		for (let cadidate of this.cart.items) {
			if (cadidate.id == id) {
				// Existing item
				item = cadidate;
				// This notifies cart item service:
				this.set('cart.items.' + pos + '.count', Number(item.count) + Number(count));
				//console.log('fairshop-cart-service.js.setItem(): Item ' + id + ' exists, adding ' + count + ' pcs.');
				break;
			}
			++pos;
		}
		if (!item) {
			item = FairshopCartItemService.newItem(id, count, productUrl);
				// This notifies cart item service:
				this.push('cart.items', item);
			//console.log('fairshop-cart-service.js.setItem(): Item ' + id + ' is new.');
		}
	}

	checkout() {
		var checkout = {
			'id': Number(this.cart.id),
			'user': null
		}
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
		var requests = Array();
		for (let item of this.cart.items) {
			var checkoutItem = {
				'orderId': Number(this.cart.id),
				'productId': Number(item.id),
				'count': Number(item.count)
		}
			this.$.requestCheckoutItem.body = checkoutItem;
			var request = this.$.requestCheckoutItem.generateRequest();
			request.setAttribute('productId', checkoutItem.productId);
			requests.push(request);
		}
		var that = this;
		Promise.all(requests).then(function (requests) {
			for (let request of requests) {
				var pos = 0;
				for (let cadidate of that.cart.items) {
					var productIdRunner = Number(cadidate.id);
					if (productIdRunner == request.getAttribute('productId')) {
						that.splice('cart.items', pos, 1);
						break;
					}
					++pos;
				}
			}
			that.newCart();
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
		this.cart.id = Number(new Date().getTime());
		this.toast.text = 'Bestellung fehlgeschlegen. Bitte versuchen Sie es später erneut.';
		this.toast.open();
	}

}
customElements.define("fairshop-cart-service", FairshopCartService);
