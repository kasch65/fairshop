import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
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
			/**
			 * Set the selected product ID to update the displayed content.
			 */
			selectedProduct: {
				type: Number,
				observer: "_productChanged"
			},
			product: {
				type: Object,
				notify: true
			},
			_productTmp: {
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
			<iron-ajax 
				id="requestProducInfo"
				url="[[restUrl]]products?filter=id,eq,[[selectedProduct]]&columns=nr,EAN,nettoPrice,price,tax,available,manufacturerName"
				handle-as="json"
				on-response="_productInfoReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductDescription"
				url="[[restUrl]]product_descriptions?filter=id,eq,[[selectedProduct]]&columns=name,description,description2"
				handle-as="json"
				on-response="_productDescriptionReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductImages"
				url="[[restUrl]]product_images?filter=productId,eq,[[selectedProduct]]&columns=small,medium,large&order=pos"
				handle-as="json"
				on-response="_productImageReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductDownloads"
				url="[[restUrl]]product_downloads?filter=productId,eq,[[selectedProduct]]&columns=description,file"
				handle-as="json"
				on-response="_productDownloadReceived">
			</iron-ajax>
		`;
	}

	_productChanged() {
		if (!this.selectedProduct) {
			this.product = null;
		}
		else {
			this._productTmp = new Object();
			this._productTmp.id = Number(this.selectedProduct);
			var completions = [
				this.$.requestProducInfo.generateRequest().completes,
				this.$.requestProductDescription.generateRequest().completes,
				this.$.requestProductImages.generateRequest().completes,
				this.$.requestProductDownloads.generateRequest().completes
			];
			var that = this;
			Promise.all(completions).then(function (completions) {
				that.product = that._productTmp;
			});
		}
	}

	_productInfoReceived(data) {
		if (data.detail.response && data.detail.response.products) {
			this._productTmp.nr = data.detail.response.products.records[0][0];
			this._productTmp.EAN = data.detail.response.products.records[0][1];
			this._productTmp.nettoPrice = data.detail.response.products.records[0][2];
			this._productTmp.price = data.detail.response.products.records[0][3];
			this._productTmp.tax = data.detail.response.products.records[0][4];
			this._productTmp.available = data.detail.response.products.records[0][5];
			this._productTmp.manufacturerName = data.detail.response.products.records[0][6];
		}
	}

	_productDescriptionReceived(data) {
		if (data.detail.response && data.detail.response.product_descriptions) {
			var newDescription = new Object();
			newDescription.name = data.detail.response.product_descriptions.records[0][0];
			newDescription.description1 = data.detail.response.product_descriptions.records[0][1];
			newDescription.description2 = data.detail.response.product_descriptions.records[0][2];
			this._productTmp.decription = newDescription;
		}
	}

	_productImageReceived(data) {
		if (data.detail.response && data.detail.response.product_images) {
			this._productTmp.images = new Array();
			for (let image of data.detail.response.product_images.records) {
				var newImages = new Object();
				newImages.small = this.imageUrl + image[0];
				newImages.medium = this.imageUrl + image[1];
				newImages.large = this.imageUrl + image[2];
				this._productTmp.images.push(newImages);
			}
		}
	}

	_productDownloadReceived(data) {
		if (data.detail.response && data.detail.response.product_downloads) {
			this._productTmp.downloads = new Array();
			for (let download of data.detail.response.product_downloads.records) {
				var newDownload = new Object();
				newDownload.description = download[0];
				newDownload.url = this.imageUrl + download[1];
				this._productTmp.downloads.push(newDownload);
			}
		}
	}

}
customElements.define("fairshop-product-service", FairshopProductService);
