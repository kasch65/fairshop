import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import { DomRepeat } from "@polymer/polymer/lib/elements/dom-repeat.js";
import { DomIf } from "@polymer/polymer/lib/elements/dom-if.js";
import './dp-form-editor.js';

class DpFormsetEditor extends PolymerElement {
  static get properties() {
    return {
      formsetDef: {
        type: Object,
        observer: "_formsetDefChanged"
      },
      formsetData: {
        type: Object,
        observer: "_formsetDataChanged"
      },
      newFormsetData: {
        type: Object,
        notify: true
      },
      lastChanged: {
        type: Date,
        observer: "_formsetNewDataChanged",
        notify: true
      },
      config: {
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
      <style>
        .page {
          position: relative;
          margin: 4px;
          background: white;
          box-shadow: 3px 3px 6px #CCC;
          z-index: 10;
        }

        .control {
          position: absolute;
          border-style: solid;
          border-color: #ccc;
          border-width: 0.5px;
          margin: 0;
          padding: 0;
          z-index: 20;
        }

        .control>.control-strokes {
          position: absolute;
          top: 0px;
          transition: top 0.3s;
          transition-timing-function: ease;
          pointer-events: none;
        }

        .control:hover>.control-strokes {
          top: -30px;
          background: rgba(255, 255, 255, 0.8);
          border-style: solid;
          border-color: #ddd;
          border-width: 0.5px;
        }

        .control:hover>.control-strokes>img {
          position: absolute;
          pointer-events: none;
        }

        .control>input,
        .control>textarea {
          position: absolute;
          width: 100%;
          height: 100%;
          border: none;
          margin: 0;
          padding: 0;
          background-color: #ccccff22;
          z-index: 30;
        }
      </style>
    
      <!-- Display user inputs as JSON -->
      <b>New FormsetData: </b>
      <div id="new-data"></div>
    
      <h2>Formularsatz: [[formsetDef.name]]</h2>
      <div id="formset_[[formsetDef.id]]" class="formset">
        <template is="dom-repeat" items="[[formsetData.form]]" as="formData">
          <template is="dom-repeat" items="[[formsetDef.formRefs]]" filter="[[_computeFormDefFilter(formData)]]" as="formDef">
            <dp-form-editor form-def="[[formDef]]" form-data="[[formData]]" formset-id="[[formsetData.formsetId]]" new-formset-data="{{newFormsetData}}" last-changed="{{lastChanged}}" config="[[config]]"></dp-form-editor>
          </template>
          <!-- TODO: implement adding optional pages. (Pages not present but available in formsetDef) -->
        </template>
      </div>
		`;
	}

  static get is() {
    return "dp-formset-editor";
  }

  ready() {
    super.ready();
  }

  /*static get observers() {
    return [
      "_configChanged(config.readOnly, config.enableInput, config.enableStroke)"
    ];
  }*/

  /* Observers */

  _formsetDataChanged(newValue, oldValue) {
    if (this.shadowRoot) {
      var newDataDiv = this.shadowRoot.querySelector("#new-data");
      newDataDiv.innerHTML = JSON.stringify(this.newFormsetData);
    }
  }

  _formsetDefChanged(newValue, oldValue) {
    console.log("DpFormsetEditor.formsetDef changed: ", newValue);
  }

  _formsetNewDataChanged(newValue, oldValue) {
    console.log("_formsetNewDataChanged.formsetData changed (newValue): ", newValue);
    console.log("_formsetNewDataChanged.formsetData changed (oldValue): ", oldValue);
    var newDataDiv = this.shadowRoot.querySelector("#new-data");
    newDataDiv.innerHTML = JSON.stringify(this.newFormsetData);
  }

  /* Filters */

  _computeFormDefFilter(formData) {
    if (!formData) {
      return null;
    } else {
      var formId = formData.formId;
      return function(formDef) {
        return formId == formDef.id;
      };
    }
  }
}

window.customElements.define(DpFormsetEditor.is, DpFormsetEditor);
