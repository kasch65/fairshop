import { PolymerElement, html } from '@polymer/polymer';

/**
 * @class
 */
export class FairshopTheme extends PolymerElement {
	static get properties() {
		return {
		};
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html `
			<custom-style>
				<style>
					:host {
						--font-weight: 400;
						--font-family: 'Roboto', sans-serif;
						--line-height: 1.5rem;
					}
					:host {
						--faishop-host: {
							box-sizing: border-box;
							font-family: var(--font-family);
							font-weight: var(--font-weight);
							line-height: var(--line-height);
							color: var(--secondary-text-color);
						}
					}
					h1,
					h2,
					h3 {
						--faishop-header: {
							font-weight: var(--font-weight);
							color: var(--primary-text-color);
						}
					}
				</style>
			</custom-style>
		`;
	}

}
customElements.define("fairshop-theme", FairshopTheme);