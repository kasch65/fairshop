import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './fairshop-image.js';
import './fairshop-styles.js';
import './fairshop-cart.js';

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
			},
			_count: {
				type: Number,
				value: 1
			},
			cart: {
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
					display: inline-block;
				}
				.info {
					display: inline-block;
				}
				h1 {
					text-align: center;
				}
				.flex {
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					width: 100%;
				}
				.flex>div {
					flex-grow: 1;
					max-width: 933px;
				}
				paper-tabs#image-tabs {
					height:	8rem;
				}
				.tab-img {
					width: 8rem;
					height: 8rem;
					margin-bottom: 5px;
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
				#shopping {
					width: 100%;
					min-height: 4.5rem;
				}
				#shopping paper-input {
					float: left;
					width: 12rem;
					margin-right: 0.5rem;
				}
				#shopping paper-button {
					top: .8rem;
				}
			</style>

			<div class="product">
				<paper-icon-button id="backBtn" icon="arrow-back" aria-label="Go back" on-click="_goBack"></paper-icon-button>
				<h1>[[_productDescription.0]]</h1>
				<div class="flex">
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
								<td>[[_productInfo.6]]</td>
							</tr>
							<tr>
								<td>Verfügbarkeit</td>
								<td>[[_productInfo.5]]</td>
							</tr>
							<tr>
								<td><b>Netto Preis</b></td>
								<td><b>[[_productInfo.2]]</b></td>
							</tr>
							<tr>
								<td><b>MwSt.</b></td>
								<td><b>[[_productInfo.4]]%</b></td>
							</tr>
							<tr>
								<td><b>Brutto Preis</b></td>
								<td><b>[[_productInfo.3]]</b></td>
							</tr>
						</table>
						<div id="shopping">
							<paper-input id="count" label="Anzahl" value="{{_count}}" always-float-label></paper-input>
							<paper-button id="addItemButton" on-click="_addItem" raised text="In den Warenkorb" raised><iron-icon icon="add-shopping-cart"></iron-icon></paper-button>
							<paper-tooltip for="addItemButton">Anzahl in den Einkaufswagen</paper-tooltip>
						</div>
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
			</div>
			<paper-dialog id="zoomDialog" modal entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-click="_onZoomOut">
				<fairshop-image id="productZoomImage" sizing="contain" src="[[imageUrl]][[_productImages.0.0]]"></fairshop-image>
			</paper-dialog>

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

	_addItem() {
		this.cart.addItem(Number(this.selectedProduct), Number(this._count), window.location.pathname);
	}

}
customElements.define("fairshop-product", FairshopProduct);
