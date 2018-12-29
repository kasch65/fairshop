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
				url="[[restUrl]]products_view?columns=nr,EAN,name,description,products_image,price,tax_rate,available,manufacturers_name&filter[]=id,eq,[[selectedProduct]]&filter[]=countries_iso_code_2,eq,DE&filter[]=language,eq,de"
				handle-as="json"
				on-response="_productInfoReceived">
			</iron-ajax>
		`;
	}

	_productChanged() {
		if (!this.selectedProduct) {
			this.product = null;
		}
		else {
			this._productTmp = {
				'id': Number(this.selectedProduct),
				'nr': null,
				'EAN': null,
				'nettoPrice': null,
				'price': null,
				'tax': null,
				'available': null,
				'manufacturerName': null,
				'description': null,
				'images': null,
				'downloads': null
			}
			var completions = [
				this.$.requestProducInfo.generateRequest().completes
			];
			var that = this;
			Promise.all(completions).then(function (completions) {
				that.product = that._productTmp;
			});
		}
	}

	_productInfoReceived(data) {
		if (data.detail.response && data.detail.response.products_view && data.detail.response.products_view.records) {
			var columns = data.detail.response.products_view.columns;
			var item = data.detail.response.products_view.records[0];
			this._productTmp.nr = this._getColumnValue(columns, 'nr', item);
			this._productTmp.EAN = this._getColumnValue(columns, 'EAN', item);
			this._productTmp.nettoPrice = Number(this._getColumnValue(columns, 'price', item)).toFixed(2);
			this._productTmp.tax = Number(this._getColumnValue(columns, 'tax_rate', item));
			this._productTmp.price = Number(Number(this._productTmp.nettoPrice) * (100 + this._productTmp.tax) / 100).toFixed(2);
			this._productTmp.available = this._getColumnValue(columns, 'available', item);
			this._productTmp.manufacturerName = this._getColumnValue(columns, 'manufacturers_name', item);
			var newDescription = {
				'name': this._getColumnValue(columns, 'name', item),
				'description1': this._getColumnValue(columns, 'description', item),
				'description2': null
			}
			this._productTmp.description = newDescription;
			this._productTmp.images = new Array();
			// TODO Use an image service
			var newImages = {
				'small': this.imageUrl + this._getColumnValue(columns, 'products_image', item),
				'medium': this.imageUrl + this._getColumnValue(columns, 'products_image', item),
				'large': this.imageUrl + this._getColumnValue(columns, 'products_image', item)
			}
			this._productTmp.images.push(newImages);
			/*this._productTmp.downloads = new Array();
			for (let download of data.detail.response.product_downloads.records) {
				var newDownload = {
					'description': download[0],
					'url': this.imageUrl + download[1]
				}
				this._productTmp.downloads.push(newDownload)
			}*/
		}
	}

	_getColumnValue(columns, name, item) {
		var pos = columns.findIndex(colName => colName == name);
		if (pos >= 0) {
			return item[pos];
		}
		console.log("Column doesn't exist: " + name);
	}

}
customElements.define("fairshop-product-service", FairshopProductService);
