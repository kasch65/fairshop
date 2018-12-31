import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { getColumnValue } from '../../fairshop-commons';
import '@polymer/iron-ajax/iron-ajax.js';

/**
 * @class
 */
export class FairshopProductService extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			product: {
				type: Object,
				notify: true,
				observer: "_productChanged"
			}
		};
	}

	static get observers() {
		return [
			'_productChanged(product.id)'
		]
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html `
			<iron-ajax 
				id="requestProducInfo"
				url="[[restUrl]]products?filter=id,eq,[[product.id]]&columns=nr,EAN,nettoPrice,price,tax,available,manufacturerName"
				handle-as="json"
				on-response="_productInfoReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductDescription"
				url="[[restUrl]]product_descriptions?filter=id,eq,[[product.id]]&columns=name,description,description2"
				handle-as="json"
				on-response="_productDescriptionReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductImages"
				url="[[restUrl]]product_images?filter=productId,eq,[[product.id]]&columns=small,medium,large&order=pos"
				handle-as="json"
				on-response="_productImageReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductDownloads"
				url="[[restUrl]]product_downloads?filter=productId,eq,[[product.id]]&columns=description,file"
				handle-as="json"
				on-response="_productDownloadReceived">
			</iron-ajax>
		`;
	}

	_productChanged() {
		if (this.product && this.product.id) {
			var completions = [
				this.$.requestProducInfo.generateRequest().completes,
				this.$.requestProductDescription.generateRequest().completes,
				this.$.requestProductImages.generateRequest().completes,
				this.$.requestProductDownloads.generateRequest().completes
			];
			var that = this;
			Promise.all(completions).then(function (completions) {
			});
		}
	}

	_productInfoReceived(data) {
		if (data.detail.response && data.detail.response.products) {
			var columns = data.detail.response.products.columns;
			var item = data.detail.response.products.records[0];
			this.set('product.nr', getColumnValue(columns, 'nr', item));
			this.set('product.EAN', getColumnValue(columns, 'EAN', item));
			this.set('product.nettoPrice', getColumnValue(columns, 'nettoPrice', item));
			this.set('product.price', getColumnValue(columns, 'price', item));
			this.set('product.count', 1);
			this.set('product.discount', 0);
			this.set('product.tax', getColumnValue(columns, 'tax', item));
			this.set('product.available', getColumnValue(columns, 'available', item));
			this.set('product.manufacturerName', getColumnValue(columns, 'manufacturerName', item));
		}
	}

	_productDescriptionReceived(data) {
		if (data.detail.response && data.detail.response.product_descriptions) {
			var columns = data.detail.response.product_descriptions.columns;
			var item = data.detail.response.product_descriptions.records[0];
			var newDescription = {
				'name': getColumnValue(columns, 'name', item),
				'description1': getColumnValue(columns, 'description', item),
				'description2': getColumnValue(columns, 'description2', item)
			}
			this.set('product.description', newDescription);
		}
	}

	_productImageReceived(data) {
		if (data.detail.response && data.detail.response.product_images) {
			var columns = data.detail.response.product_images.columns;
			var images = new Array();
			for (let item of data.detail.response.product_images.records) {
				var newImages = {
					'small': this.imageUrl + getColumnValue(columns, 'small', item),
					'medium': this.imageUrl + getColumnValue(columns, 'medium', item),
					'large': this.imageUrl + getColumnValue(columns, 'large', item)
				}
				images.push(newImages);
			}
			this.set('product.images', images);
		}
	}

	_productDownloadReceived(data) {
		if (data.detail.response && data.detail.response.product_downloads) {
			var columns = data.detail.response.product_downloads.columns;
			var downloads = new Array();
			for (let item of data.detail.response.product_downloads.records) {
				var newDownload = {
					'description': getColumnValue(columns, 'description', item),
					'url': this.imageUrl + getColumnValue(columns, 'file', item)
				}
				downloads.push(newDownload)
			}
			this.set('product.downloads', downloads);
		}
	}

}
customElements.define("fairshop-product-service", FairshopProductService);
