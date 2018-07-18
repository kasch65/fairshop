import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

/**
 * @class
 */
export class FairshopImage extends PolymerElement {
	static get properties() {
		return {
			src: {
				type: String
			},
			placeholder: {
				type: String
			},
			sizing: {
				type: String,
				value: 'contain'
			},
			_placeholderBg: {
				type: String,
				value: ''
			},
			_imgBg: {
				type: String,
				value: ''
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
				:host {
					display: inline-block;
					overflow: hidden;
					position: relative;
				}
				#img {
					width: 0;
					height: 0;
				}
				#placeholderDiv,
				#imgDiv {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					width: 100%;
					height: 100%;
					background-position: center center;
					background-repeat: no-repeat;
				}
				#placeholderDiv {
					opacity: 1;
				}
				#imgDiv {
					opacity: 0;
				}
				#placeholderDiv.loaded {
					opacity: 0;
					transition: opacity 0.3s;
				}
				#imgDiv.loaded {
					opacity: 1;
					transition: opacity 0.3s;
				}
			</style>
			<img id="img" src="[[src]]" on-load="_loaded"></img>
			<div id="placeholderDiv" style="[[_placeholderBg]]"></div>
			<div id="imgDiv" style="[[_imgBg]]"></div>
		`;
	}

	ready() {
		super.ready();
		this._placeholderBg = 'background-image: url("' + this.placeholder + '"); background-size: ' + this.sizing + ';';
	}

	_loaded() {
		this._imgBg = 'background-image: url("' + this.src + '"); background-size: ' + this.sizing + ';';
		this.$.placeholderDiv.classList.add("loaded");
		this.$.imgDiv.classList.add("loaded");
	}

}
customElements.define("fairshop-image", FairshopImage);
