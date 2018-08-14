import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './fairshop-image.js';
import './fairshop-styles.js';

/**
 * @class
 */
export class FairshopProduct extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			imageUrl: {
				type: String
			},
			selectedProduct: {
				type: Number,
				observer: "_productChanged"
			},
			_productInfo: {
				type: Object
			},
			_productDescription: {
				type: Object
			},
			_productImages: {
				type: Array
			},
			_productDownloads: {
				type: Array
			},
			_selected: {
				type: Number,
				value: 0
			},
			_selectedTab: {
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
				paper-tabs {
					--paper-tabs-selection-bar-color: var(--google-blue-700);
				}
				#backBtn {
					position: absolute;
					right: 1.2rem;
					top: 4rem;
					z-index: 50;
				}
				.images {
					width: 49%;
					display: inline-block;
				}
				.info {
					width: 49%;
					display: inline-block;
				}
				h1 {
					text-align: center;
				}
				paper-tabs#image-tabs {
					height:	8rem;
				}
				.tab-img {
					width: 8rem;
					height: 8rem;
				}
				.detail-img {
					width: 100%;
					height: 30rem;
					cursor: zoom-in;
				}
				.article-tabs {
					height: 18rem;
					overflow: auto;
				}
				/*.shade {
					width: 100vw;
					height: 100vh;
					position: fixed;
					top: 0;
					left: 0;
					background-color: var(--iron-overlay-backdrop-background-color, #000);
					opacity: var(--iron-overlay-backdrop-opacity, 0.6);
					transition: opacity 0.2s;
					z-index: 200;
					pointer-events: none;
				}*/
				#zoomDialog {
					cursor: zoom-out;
					width: 90vw;
					height: 90vh;
					z-index: 300;
				}
				#productZoomImage {
					max-height: inherit;
					margin: 0;
					width: 100%;
					height: 100%;
				}
			</style>

			<div class="product">
				<paper-icon-button id="backBtn" icon="arrow-back" aria-label="Go back" on-click="_goBack"></paper-icon-button>
				<h1>[[_productDescription.0]]</h1>
				<div class="images">
					<iron-pages selected="{{_selected}}" entry-animation="slide-from-top-animation">
						<template is="dom-repeat" items="[[_productImages]]" as="productImage">
							<div>
								<fairshop-image class="detail-img" sizing="contain" src="[[imageUrl]][[productImage.1]]" alt\$="[[productImage.1]]" zoom="[[imageUrl]][[productImage.2]]" on-click="_onZoom"></fairshop-image>
							</div>
						</template>
					</iron-pages>
					<paper-tabs id="image-tabs" selected="{{_selected}}" scrollable>
						<template is="dom-repeat" items="[[_productImages]]" as="productImage">
							<paper-tab>
								<fairshop-image class="tab-img" sizing="contain" src="[[imageUrl]][[productImage.0]]" alt\$="[[productImage.0]]"></fairshop-image>
							</paper-tab>
						</template>
					</paper-tabs>
				</div>
				<div class="info">
					<h2>[[_productDescription.1]]</h2>
					<table>
						<tr>
							<td>Artikelnummer</td>
							<td>[[_productInfo.0]]</td>
						</tr>
						<tr>
							<td>EAN</td>
							<td>[[_productInfo.1]]</td>
						</tr>
						<tr>
							<td>Hersteller</td>
							<td>[[_productInfo.4]]</td>
						</tr>
						<tr>
							<td>Verfügbarkeit</td>
							<td>[[_productInfo.3]]</td>
						</tr>
						<tr>
							<td><b>Preis</b></td>
							<td><b>[[_productInfo.2]]</b></td>
						</tr>
					</table>
					<div class="tabs">
						<paper-tabs selected="{{_selectedTab}}" scrollable>
							<paper-tab>Beschreibung</paper-tab>
							<paper-tab>Artikel Attribute</paper-tab>
							<paper-tab>Downloads</paper-tab>
						</paper-tabs>
						<iron-pages id="tabPages" class="article-tabs" selected="{{_selectedTab}}">
							<div id="descriptionTab"></div>
							<div>...</div>
							<div id="download">
								<template is="dom-repeat" items="[[_productDownloads]]" as="productDownload">
									<a href$="[[imageUrl]][[productDownload.1]]" target="_blank">
										[[productDownload.0]]
										<template is="dom-if" if="[[_isEmpty(productDownload.0)]]">[[productDownload.1]]</template>
									</a>
								</template>
							</div>
						</div>
						</iron-pages>
						<div></div>
						<div class="downloads">
						</div>
					</div>
				</div>
			</div>
			<paper-dialog id="zoomDialog" modal entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-click="_onZoomOut">
				<fairshop-image id="productZoomImage" sizing="contain" src="[[imageUrl]][[_productImages.0.0]]"></fairshop-image>
			</paper-dialog>

			<iron-ajax 
				id="requestProducInfo"
				url="[[restUrl]]products?filter=id,eq,[[selectedProduct]]&columns=nr,EAN,price,available,manufacturerName"
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
				url="[[restUrl]]product_images?filter=productId,eq,[[selectedProduct]]&columns=small,medium,large"
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
			this._productInfo = null;
			this._productDescription = null;
			this._productImages = null;
			this._productDownloads = null;
		}
		else {
			this.$.requestProducInfo.generateRequest();
			this.$.requestProductDescription.generateRequest();
			this.$.requestProductImages.generateRequest();
			this.$.requestProductDownloads.generateRequest();
		}
		this._selected = 0;
		this._selectedTab = 0;
	}

	_productInfoReceived(data) {
		if (data.detail.response && data.detail.response.products) {
			this._productInfo = data.detail.response.products.records[0];
		}
	}

	_productDescriptionReceived(data) {
		if (data.detail.response && data.detail.response.product_descriptions) {
			this._productDescription = data.detail.response.product_descriptions.records[0];
			// Add HTML to description tab
			this.$.descriptionTab.innerHTML =this._productDescription[2];
		}
	}

	_productImageReceived(data) {
		if (data.detail.response && data.detail.response.product_images) {
			this._productImages = data.detail.response.product_images.records;
		}
	}

	_productDownloadReceived(data) {
		if (data.detail.response && data.detail.response.product_downloads) {
			this._productDownloads = data.detail.response.product_downloads.records;
		}
	}

	_goBack() {
		window.history.back();
	}

	_isEmpty(downloadName) {
		if (downloadName && downloadName.length > 0) {
			return false;
		}
		else {
			return true;
		}
	}

  _onZoom(ev) {
		this.$.productZoomImage.src = ev.target.zoom;
		this.$.zoomDialog.open();
  }

  _onZoomOut(ev) {
    this.$.zoomDialog.close();
  }

}
customElements.define("fairshop-product", FairshopProduct);
