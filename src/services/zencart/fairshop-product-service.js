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
			'_productChanged(product.id)',
			'_countChanged(product.count)'
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
				url="[[restUrl]]products_view?columns=nr,EAN,name,description,products_image,price,tax_rate,available,manufacturers_name&filter[]=id,eq,[[product.id]]&filter[]=countries_iso_code_2,eq,DE&filter[]=language,eq,de"
				handle-as="json"
				on-response="_productInfoReceived">
			</iron-ajax>

			<iron-ajax 
				id="getProductDiscount"
				url="[[restUrl]]products_quantity_discount_view?columns=discount_price&filter[]=products_id,eq,[[product.id]]&filter[]=from,le,[[product.count]]&order=from,desc&page=1,1"
				handle-as="json"
				on-response="_productDiscountReceived">
			</iron-ajax>

			<iron-ajax 
				id="getProductImages"
				handle-as="json"
				on-response="_productImagesReceived">
			</iron-ajax>
		`;
	}

	_productChanged() {
		if (this.product && this.product.id) {
			var completions = [
				this.$.requestProducInfo.generateRequest().completes
			];
			var that = this;
			Promise.all(completions).then(function (completions) {
			});
		}
	}

	_countChanged() {
		console.log('Count changed: ' + this.product.count);
		if (this.product.count > 1) {
			this.$.getProductDiscount.generateRequest();
		}
		else {
			this.set('product.discount', 0);
		}
	}

	_productInfoReceived(data) {
		if (data.detail.response && data.detail.response.products_view && data.detail.response.products_view.records) {
			var columns = data.detail.response.products_view.columns;
			var item = data.detail.response.products_view.records[0];
			this.set('product.nr', getColumnValue(columns, 'nr', item));
			this.set('product.EAN', getColumnValue(columns, 'EAN', item));
			this.set('product.nettoPrice', Number(getColumnValue(columns, 'price', item)).toFixed(2));
			this.set('product.count', 1);
			this.set('product.discount', 0);
			this.set('product.tax', Number(getColumnValue(columns, 'tax_rate', item)));
			this.set('product.price', Number(Number(this.product.nettoPrice) * (100 - this.product.discount) / 100 * (100 + this.product.tax) / 100).toFixed(2));
			this.set('product.available', getColumnValue(columns, 'available', item));
			this.set('product.manufacturerName', getColumnValue(columns, 'manufacturers_name', item));
			var newDescription = {
				'name': getColumnValue(columns, 'name', item),
				'description1': getColumnValue(columns, 'description', item),
				'description2': null
			}
			this.set('product.description', newDescription);
			// TODO Use an image service
			var images = new Array();
			var newImages = {
				'small': this.imageUrl + getColumnValue(columns, 'products_image', item),
				'medium': this.imageUrl + getColumnValue(columns, 'products_image', item),
				'large': this.imageUrl + getColumnValue(columns, 'products_image', item)
			}
			images.push(newImages);
			this.set('product.images', images);
			this.$.getProductImages.url = this.restUrl + '../zc-image-service.php?image=' + getColumnValue(columns, 'products_image', item);
			this.$.getProductImages.generateRequest();
			/*this.product.downloads = new Array();
			for (let download of data.detail.response.product_downloads.records) {
				var newDownload = {
					'description': download[0],
					'url': this.imageUrl + download[1]
				}
				this.product.downloads.push(newDownload)
			}*/
		}
	}

	_productDiscountReceived(data) {
		if (data.detail.response && data.detail.response.products_quantity_discount_view && data.detail.response.products_quantity_discount_view.records) {
			var columns = data.detail.response.products_quantity_discount_view.columns;
			var item = data.detail.response.products_quantity_discount_view.records[0];
			if (item) {
				this.set('product.discount', Number(getColumnValue(columns, 'discount_price', item)));
				this.set('product.price', Number(Number(this.product.nettoPrice) * (100 - this.product.discount) / 100 * (100 + this.product.tax) / 100).toFixed(2));
			}
		}
	}

	_productImagesReceived(data) {
		if (data.detail.response) {
			var pos = 0;
			for (let image of data.detail.response) {
				console.log(image);
				var smallImage = image.small;
				if (!smallImage) {
					smallImage = image.medium;
				}
				if (!smallImage) {
					smallImage = image.large;
				}
				var mediumImage = image.medium;
				if (!mediumImage) {
					mediumImage = image.large;
				}
				if (!mediumImage) {
					mediumImage = image.small;
				}
				var largeImage = image.large;
				if (!largeImage) {
					largeImage = image.medium;
				}
				if (!largeImage) {
					largeImage = image.small;
				}
				if (pos == 0) {
					this.set('product.images.0.small', this.imageUrl + smallImage);
					this.set('product.images.0.medium', this.imageUrl + mediumImage);
					this.set('product.images.0.large', this.imageUrl + largeImage);
				}
				else {
					var newImages = {
						'small': this.imageUrl + smallImage,
						'medium': this.imageUrl + mediumImage,
						'large': this.imageUrl + largeImage
					}
					this.push('product.images', newImages);
				}
				pos++;
			}
		}
	}

}
customElements.define("fairshop-product-service", FairshopProductService);
