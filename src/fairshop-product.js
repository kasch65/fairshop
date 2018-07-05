import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/iron-image/iron-image.js';

/**
 * @class
 */
export class FairshopProduct extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
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
			}
		};
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html `
			<style>
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
				paper-tabs {
					height:	8rem;
				}
				.tab-img {
					width: 8rem;
					height: 8rem;
				}
				.detail-img {
					width: 100%;
					height: 30rem;
				}
				.article-tabs {
					height: 18rem;
					overflow: auto;
				}
			</style>
			<template is="dom-if" if="[[selectedProduct]]">
				<div class="product">
					<h1>[[_productDescription.2]]</h1>
					<div class="images">
						<iron-pages selected="{{_selected}}" entry-animation="slide-from-top-animation">
							<template is="dom-repeat" items="[[_productImages]]" as="productImage">
								<div>
									<a href="http://bukhtest.alphaplanweb.de/[[productImage.5]]" target="_blank">
										<iron-image class="detail-img" sizing="contain" src="http://bukhtest.alphaplanweb.de/[[productImage.4]]" alt\$="[[productImage.4]]"></iron-image>
									</a>
								</div>
							</template>
						</iron-pages>
						<paper-tabs selected="{{_selected}}" scrollable>
							<template is="dom-repeat" items="[[_productImages]]" as="productImage">
								<paper-tab>
									<iron-image class="tab-img" sizing="contain" src="http://bukhtest.alphaplanweb.de/[[productImage.3]]" alt\$="[[productImage.3]]"></iron-image>
								</paper-tab>
							</template>
						</paper-tabs>
					</div>
					<div class="info">
						<h2>[[_productDescription.3]]</h2>
						<table>
							<tr>
								<td>Artikelnummer</td>
								<td>[[_productInfo.1]]</td>
							</tr>
							<tr>
								<td>EAN</td>
								<td>[[_productInfo.2]]</td>
							</tr>
						</table>
						<div class="tabs">
							<paper-tabs selected="{{_selectedTab}}" scrollable>
								<paper-tab class="iron-selected" focused="true" aria-selected="true">Beschreibung</paper-tab>
								<paper-tab>Artikel Attribute</paper-tab>
								<paper-tab>Downloads</paper-tab>
							</paper-tabs>
							<iron-pages class="article-tabs" selected="{{_selectedTab}}">
								<div class="iron-selected">[[_productDescription.4]]</div>
								<div>...</div>
								<div>
									<template is="dom-repeat" items="[[_productDownloads]]" as="productDownload">
										<div class="download">
											<a href$="http://bukhtest.alphaplanweb.de/[[productDownload.4]]" target="_blank">Download: [[productDownload.3]]</a>
										</div>
									</template>
								</div>
							</iron-pages>
							<div></div>
							<div class="downloads">
							</div>
						</div>
					</div>
				</div>
			</template>

			<iron-ajax 
				id="requestProducInfo"
				url="[[restUrl]]products?filter=id,eq,[[selectedProduct]]"
				handle-as="json"
				on-response="_productInfoReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductDescription"
				url="[[restUrl]]product_descriptions?filter=id,eq,[[selectedProduct]]"
				handle-as="json"
				on-response="_productDescriptionReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductImages"
				url="[[restUrl]]product_images?filter=productId,eq,[[selectedProduct]]"
				handle-as="json"
				on-response="_productImageReceived">
			</iron-ajax>

			<iron-ajax 
				id="requestProductDownloads"
				url="[[restUrl]]product_downloads?filter=productId,eq,[[selectedProduct]]"
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
	}

	_productInfoReceived(data) {
		this._productInfo = data.detail.response.products.records[0];
	}

	_productDescriptionReceived(data) {
		this._productDescription = data.detail.response.product_descriptions.records[0];
	}

	_productImageReceived(data) {
		this._productImages = data.detail.response.product_images.records;
	}

	_productDownloadReceived(data) {
		this._productDownloads = data.detail.response.product_downloads.records;
	}
}
customElements.define("fairshop-product", FairshopProduct);
