import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import { DomRepeat } from "@polymer/polymer/lib/elements/dom-repeat.js";
import { DomIf } from "@polymer/polymer/lib/elements/dom-if.js";
import './dp-form-control.js';
import './dp-strokes-svg.js';

class DpFormEditor extends PolymerElement {
  static get properties() {
    return {
      formsetId: {
        type: Number
      },
      formDef: {
        type: Object,
        observer: "_formDefChanged"
      },
      formData: {
        type: Object,
        observer: "_formDataChanged"
      },
      newFormsetData: {
        type: Object,
        notify: true
      },
      lastChanged: {
        type: Date,
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
          box-shadow: 3px 3px 6px #CCC;
          z-index: 10;
        }

        .page .unassigned-strokes {
          position: absolute;
          top: 0px;
          transition: top 0.3s;
          transition-timing-function: ease;
          pointer-events: none;
        }

        #read-only-mode {
          display: none;
          z-index: 99999;
          position: absolute;
          top: 0;
          left: 0;
          background-color: #fff;
          opacity: .00;
        }
      </style>

      <h3>Form: [[formDef.name]]</h3>
      <div id="form_[[formDef.id]]" class="page" style="width: [[formDef.papersize.width]]px; height: [[formDef.papersize.height]]px;">
        <!-- Render unassigned strokes -->
        <template is="dom-if" if="[[config.enableStroke]]">
          <template is="dom-if" if="[[_hasStrokes()]]">
            <div id="unassigned-strokes-[[formDef.id]]" class="unassigned-strokes" style="width: [[formDef.papersize.width]]px; height: [[formDef.papersize.height]]px; z-index: 15;">
              <template is="dom-repeat" items="[[formData.input]]" as="input">
                <dp-strokes-svg input="[[input]]" ,="" x="[[formDef.papersize.x]]" y="[[formDef.papersize.y]]" color="#776688"></dp-strokes-svg>
              </template>
            </div>
          </template>
        </template>
        <!-- Render controls (design and inputs) -->
        <template is="dom-repeat" items="[[formDef.formControl]]" as="controlDef">
          <dp-form-control control-def="[[controlDef]]" control-data="[[_getControlData(controlDef)]]" formset-id="[[formsetId]]" form-id="[[formDef.id]]" new-formset-data="{{newFormsetData}}" last-changed="{{lastChanged}}" config="[[config]]"></dp-form-control>
        </template>
        <div id="read-only-mode" style="width: [[formDef.papersize.width]]px; height: [[formDef.papersize.height]]px;"></div>
      </div>
    `;
  }

  static get is() {
    return "dp-form-editor";
  }

  ready() {
    super.ready();
  }

  /* Observers */

  _formDefChanged(newValue, oldValue) {
    console.log("DpFormEditor.formsetDef changed: ", newValue);
  }

  _formDataChanged(newValue, oldValue) {
    console.log("DpFormEditor.formsetData changed: ", newValue);
  }

  // Filters

  _hasStrokes() {
    if (this.formData && this.formData.input) {
      for (let input of this.formData.input) {
        for (let stroke of input.stroke) {
          return true;
        }
      }
    }
    return false;
  }

  // Stroke renderer

  _getSvg(input, x, y) {
    var sb = [];
    sb.push('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg">');
    for (let stroke of input.stroke) {
      sb.push(
        ' <polyline style="fill: none; stroke: #333388; stroke-width: 1.3; stroke-linecap: round; stroke-linejoin: round" points="'
      );
      for (let sample of stroke.sample) {
        sb.push(" ");
        sb.push(sample.x - x);
        sb.push(",");
        sb.push(sample.y - y);
      }
      sb.push('"></polyline>');
    }
    sb.push("</svg>");
    return sb.join("");
  }

  /* Helpers */

  _getControlData(controlDef) {
    for (let controlData of this.formData.control) {
      if (controlData.formControlId == controlDef.id) {
        return controlData;
      }
    }
    return null;
  }
}

window.customElements.define(DpFormEditor.is, DpFormEditor);
