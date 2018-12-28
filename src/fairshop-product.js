import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './services/bukhtest/fairshop-product-service.js';
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
			/**
			 * Set the selected product ID to update the displayed content.
			 */
			selectedProduct: {
				type: Number
			},
			_product: {
				type: Object
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
					width: 100%;
					max-width: 104rem;
					margin: auto;
					display: grid;
					grid-gap: .2rem;
					grid-template-columns: repeat(auto-fill, minmax(35rem, 2fr));
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

			<fairshop-product-service rest-url="[[restUrl]]" image-url="[[imageUrl]]" selected-product="[[selectedProduct]]" product="{{_product}}"></fairshop-product-service>
			<div class="product">
				<paper-icon-button id="backBtn" icon="arrow-back" aria-label="Go back" on-click="_goBack"></paper-icon-button>
				<h1>[[_product.name]]</h1>
				<div class="flex">
					<div class="images">
						<iron-pages selected="{{_selected}}" entry-animation="slide-from-top-animation">
							<template is="dom-repeat" items="[[_product.images]]" as="productImage">
								<div>
									<fairshop-image class="detail-img" sizing="contain" src="[[productImage.medium]]" alt\$="[[productImage.medium]]" zoom="[[productImage.large]]" on-click="_onZoom"></fairshop-image>
								</div>
							</template>
						</iron-pages>
						<paper-tabs id="image-tabs" selected="{{_selected}}" scrollable>
							<template is="dom-repeat" items="[[_product.images]]" as="productImage">
								<paper-tab>
									<fairshop-image class="tab-img" sizing="contain" src="[[productImage.small]]" alt\$="[[productImage.small]]"></fairshop-image>
								</paper-tab>
							</template>
						</paper-tabs>
					</div>
					<div class="info">
						<h2>[[_product.description.name]]</h2>
						<table>
							<tr>
								<td>Artikelnummer</td>
								<td>[[_product.nr]]</td>
							</tr>
							<tr>
								<td>EAN</td>
								<td>[[_product.EAN]]</td>
							</tr>
							<tr>
								<td>Hersteller</td>
								<td>[[_product.manufacturerName]]</td>
							</tr>
							<tr>
								<td>Verfügbarkeit</td>
								<td>[[_product.available]]</td>
							</tr>
							<tr>
								<td><b>Netto Preis</b></td>
								<td><b>[[_product.nettoPrice]]</b></td>
							</tr>
							<tr>
								<td><b>MwSt.</b></td>
								<td><b>[[_product.tax]]%</b></td>
							</tr>
							<tr>
								<td><b>Brutto Preis</b></td>
								<td><b>[[_product.price]]</b></td>
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
								[[_setProductDescriptionHtml(_product.description)]]
								<div id="descriptionTab"></div>
								<div>...</div>
								<div id="download">
									<template is="dom-repeat" items="[[_product.downloads]]" as="productDownload">
										<a href$="[[productDownload.url]]" target="_blank">
											[[productDownload.description]]
											<template is="dom-if" if="[[_isEmpty(productDownload.description)]]">[[productDownload.url]]</template>
										</a>
									</template>
								</div>
							</iron-pages>
							<div class="downloads">
							</div>
						</div>
					</div>
				</div>
			</div>
			<paper-dialog id="zoomDialog" modal entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-click="_onZoomOut">
				<fairshop-image id="productZoomImage" sizing="contain" src="[[_product.images.0.small]]"></fairshop-image>
			</paper-dialog>
		`;
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
		this.cart.setItem(Number(this.selectedProduct), Number(this._count), window.location.pathname);
	}

	_setProductDescriptionHtml(description) {
		// Add HTML to description
		var html = '';
		if (description && description.description1) {
			html += '<p>' + description.description1 + '</p>';
		}
		if (description && description.description2) {
			html += '<p>' + description.description2 + '</p>';
		}
		this.$.descriptionTab.innerHTML = html;
	}

}
customElements.define("fairshop-product", FairshopProduct);
