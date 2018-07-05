import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-checkbox/paper-checkbox.js';

/**
 * @class
 */
export class DPFormsetList extends PolymerElement {
	static get properties() {
		return {
			formsetList: {
				type: Object
			},
			selectedFormsetId: {
				type: Number,
				notify: true
			},
			activeFormsetElement: {}
		};
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html `
			<style>
				ul {
					list-style-type: none;
					padding: 0;
				}

				li>span {
					cursor: pointer;
					text-decoration: underline;
				}

				li.collapsed>ol {
					display: none;
				}

				.toggle {
					width: 1.4rem;
					height: 1.4rem;
				}

				span.toggle,
				span.toggle>iron-icon {
					text-decoration: none;
				}

				span>iron-icon.hidden {
					display: none;
				}

				span.formset.active {
					background-color: var(--light-primary-color);
				}
			</style>
			<ul>
				<template is="dom-repeat" items="[[formsetList.formset]]" as="formset">
					<li class="collapsed">
						<span class="toggle" on-click="_toggle">
							<iron-icon class="hidden expanded" icon="icons:expand-more"></iron-icon>
							<iron-icon class="collapsed" icon="icons:chevron-right"></iron-icon>
						</span>
						<paper-checkbox id="cb_[[formset.id]]"></paper-checkbox>
						<span class="formset" href="[[formset.id]]" on-click="_loadFormset">[[formset.name]]</span>
						<ol>
							<template is="dom-repeat" items="[[formset.formRefs]]" as="form">
								<li>[[form.name]]</li>
							</template>
						</ol>
					</li>
				</template>
			</ul>
		`;
	}

	_toggle(ev) {
		var btn = ev.target.parentElement;
		var li = btn.parentElement;
		if (li.classList.contains('collapsed')) {
			li.classList.remove('collapsed');
			btn.childNodes[3].classList.add("hidden");
			btn.childNodes[1].classList.remove("hidden");
		}
		else {
			li.classList.add('collapsed');
			btn.childNodes[1].classList.add("hidden");
			btn.childNodes[3].classList.remove("hidden");
		}
	}

	_loadFormset(ev) {
		if (this.activeFormsetElement) {
			this.activeFormsetElement.classList.remove("active");
		}
		this.activeFormsetElement = ev.target;
		ev.target.classList.add("active");
		this.selectedFormsetId = ev.target.href;
	}
	
}
customElements.define("dp-formset-list", DPFormsetList);
