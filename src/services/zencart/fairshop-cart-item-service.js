import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';

/**
 * @class
 */
export class FairshopCartItemService extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			item: {
				type: Object,
				notify: true
			}
		};
	}

	static get observers() {
		return [
			'countChanged(item.count)'
		]
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html `
			<iron-ajax 
				id="getProductDescriptions"
				url="[[restUrl]]product_search_copy?filter=id,eq,[[item.id]]&columns=nettoPrice,price,tax,available,name"
				handle-as="json">
			</iron-ajax>

			<iron-ajax 
				id="requestProductImages"
				url="[[restUrl]]product_images?filter=productId,eq,[[item.id]]&columns=small&order=pos&page=1,1"
				handle-as="json">
			</iron-ajax>
		`;
	}

	ready() {
		super.ready();
		var completions = [
			this.$.getProductDescriptions.generateRequest().completes,
			this.$.requestProductImages.generateRequest().completes
		];
		//console.log('fairshop-cart-item-service.js.requestItemData(): Item ' + this.item.id + '.');
		var that = this;
		Promise.all(completions).then(function (completions) {
			if (completions[0].response && completions[0].response.product_search_copy && completions[0].response.product_search_copy.records) {
				var productInfo = completions[0].response.product_search_copy.records[0];
				that.set('item.oneNettoPrice', productInfo[0]);
				that.set('item.onePrice', productInfo[1]);
				that.set('item.tax', productInfo[2]);
				that.set('item.available', productInfo[3]);
				that.set('item.name', productInfo[4]);
			}
			if (completions[1].response && completions[1].response.product_images && completions[1].response.product_images.records) {
				that.set('item.image', that.imageUrl + completions[1].response.product_images.records[0]);
			}
			that.countChanged(that.item);
			//console.log('fairshop-cart-item-service.js.requestItemData().Promise.all: Data for item ' + that.item.id + ' reveived.');
		});
	}

	/**
	 * Static method
	 * Create a new item object, with no rest calls or calulations
	 * @param {*} id 
	 * @param {*} count 
	 * @param {*} productUrl 
	 */
	static newItem(id, count, productUrl) {
		return {
			'id': Number(id),
			'url': productUrl,
			'count': Number(count),
			'available': null,
			'oneNettoPrice': null,
			'allNettoPrice': null,
			'onePrice': null,
			'allPrice': null,
			'tax': null,
			'name': null,
			'image': null
		};
	}

	/**
	 * Recalculate the all prices. Could also recalculate discounts.
	 * Raises 'cart-event'
	 */
	countChanged() {
		//console.log('fairshop-cart-item-service.js.countChanged(): Count for item ' + this.item.id + ' cahnged. Recalculating...');
		if (!this.item.oneNettoPrice || !this.item.onePrice || !(this.item.count >= 0)) {
			//console.log('fairshop-cart-item-service.js.countChanged(): Count for item ' + this.item.id + ' skipped.');
			return;
		}
		var allNettoPrice = this.item.count * this.item.oneNettoPrice;
		if (!isNaN(allNettoPrice)) {
			this.set('item.allNettoPrice', allNettoPrice.toFixed(2));
		}
		var allPrice = this.item.count * this.item.onePrice;
		if (!isNaN(allPrice)) {
			this.set('item.allPrice', allPrice.toFixed(2));
		}
		document.dispatchEvent(new CustomEvent('cart-event', {detail: 'price-changed'}));
		}

}
customElements.define("fairshop-cart-item-service", FairshopCartItemService);
