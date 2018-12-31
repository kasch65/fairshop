import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { getColumnValue } from '../../fairshop-commons';
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
				id="getProductInfo"
				url="[[restUrl]]products_view?columns=price,tax_rate,available,name,products_image&filter=id,eq,[[item.id]]"
				handle-as="json">
			</iron-ajax>

			<iron-ajax 
				id="getProductDiscount"
				url="[[restUrl]]products_quantity_discount_view?columns=discount_price&filter[]=products_id,eq,[[item.id]]&filter[]=from,le,[[item.count]]&order=from,desc&page=1,1"
				handle-as="json">
			</iron-ajax>
		`;
	}

	ready() {
		super.ready();
		var completions = [
			this.$.getProductInfo.generateRequest().completes
		];
		//console.log('fairshop-cart-item-service.js.requestItemData(): Item ' + this.item.id + '.');
		var that = this;
		Promise.all(completions).then(function (completions) {
			if (completions[0].response && completions[0].response.products_view && completions[0].response.products_view.records) {
				var columns = completions[0].response.products_view.columns;
				var productInfo = completions[0].response.products_view.records[0];

				that.set('item.oneNettoPrice', Number(getColumnValue(columns, 'price', productInfo)).toFixed(2));
				that.set('item.tax', Number(getColumnValue(columns, 'tax_rate', productInfo)));
				that.set('item.onePrice', Number(Number(that.item.oneNettoPrice) * (100 + that.item.tax) / 100).toFixed(2));
				that.set('item.available', getColumnValue(columns, 'available', productInfo));
				that.set('item.name', getColumnValue(columns, 'name', productInfo));
				that.set('item.image', that.imageUrl + getColumnValue(columns, 'products_image', productInfo));
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
			'available': null,
			'oneNettoPrice': null,
			'count': Number(count),
			'allNettoPrice': null,
			'tax': null,
			'quantityDiscount': 0,
			'onePrice': null,
			'allPrice': null,
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
		var oneNettoPrice = Number(this.item.oneNettoPrice);
		var onePrice = oneNettoPrice * (100 + this.item.tax) / 100;
		var allNettoPrice = oneNettoPrice * this.item.count;
		var allPrice = onePrice * this.item.count;
		// Request quantity discont
		var completions = [
			this.$.getProductDiscount.generateRequest().completes
		];
		var that = this;
		Promise.all(completions).then(function (completions) {
			if (completions[0].response && completions[0].response.products_quantity_discount_view && completions[0].response.products_quantity_discount_view.records) {
				var columns = completions[0].response.products_quantity_discount_view.columns;
				// Apply quantity discount
				if (completions[0].response.products_quantity_discount_view.records[0]) {
					var discount = Number(completions[0].response.products_quantity_discount_view.records[0]);
					that.set('item.quantityDiscount', discount);
					allNettoPrice *= (100 - discount) / 100;
					onePrice *= (100 - discount) / 100;
					allPrice *= (100 - discount) / 100;
				}
			}
			that.set('item.allNettoPrice', Number(allNettoPrice).toFixed(2));
			that.set('item.onePrice', Number(onePrice).toFixed(2));
			that.set('item.allPrice', Number(allPrice).toFixed(2));
		
			document.dispatchEvent(new CustomEvent('cart-event', {detail: 'price-changed'}));
		});
	}

}
customElements.define("fairshop-cart-item-service", FairshopCartItemService);
