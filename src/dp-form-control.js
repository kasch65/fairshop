import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import { DomRepeat } from "@polymer/polymer/lib/elements/dom-repeat.js";
import { DomIf } from "@polymer/polymer/lib/elements/dom-if.js";
import './dp-strokes-svg.js';

class DpFormControl extends PolymerElement {
  static get properties() {
    return {
      formsetId: {
        type: Number
      },
      formId: {
        type: Number
      },
      controlDef: {
        type: Object,
        observer: "_controlDefChanged"
      },
      controlData: {
        type: Object,
        observer: "_controlDataChanged"
      },
      newFormsetData: {
        type: Object,
        notify: true
      },
      lastChanged: {
        type: Date,
        notify: true
      },
      _value: {
        type: String
      },
      _scoreColor: {
        type: String
      },
      _changed: {
        type: Boolean,
        value: false
      },
      _hasFocus: {
        type: Boolean,
        value: false
      },
      _alternativeValues: {
        type: Array,
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

        .control:hover>.control-strokes,
        .control.active>.control-strokes {
          top: -30px; /* TODO: Shift should deppend on control height */
          background: rgba(255, 255, 255, 0.8);
          border-style: solid;
          border-color: #ddd;
          border-width: 0.5px;
        }
        
        .control.active>.dropdown {
          position: absolute;
          background: rgba(255, 255, 255, 0.8);
          border-style: solid;
          border-color: #ddd;
          border-width: 0.5px;
          z-index: 99;
        }

        .control .dropdown {
          display: none;
        }

        .control.active>.dropdown .popup {
          -webkit-border-radius: 7px;
          -moz-border-radius: 7px;
          border-radius: 7px;
          padding: 0;
          text-align: center;
          text-indent: 0px;
          color: #FFFFFF;
          text-shadow: #5B5B5B 0px -1px 0px;
          font: 14px/18px "Myriad Pro";
          // margin: 20px;
          -webkit-box-shadow: 2px 2px 3px rgba(0,0,0,.4);
          -moz-box-shadow: 2px 2px 3px rgba(0,0,0,.4);
          box-shadow: 2px 2px 3px rgba(0,0,0,.4);
        }
        .control.active>.dropdown .popup * {
          color: #fff !important;
        }

        .control.active>.dropdown .popup ul {
          list-style: none;
          margin: 0;
          padding: 4px 8px;
          -webkit-border-radius: 7px;
          -moz-border-radius: 7px;
          border-radius: 7px;
        }

        .control.active>.dropdown .popup li {
          border-bottom: solid 1px rgba(20,20,20,.4);
          border-top: solid 1px rgba(80,80,80,.4);
          padding: 2px 0 0;
          line-height: 1.6em;
          cursor: pointer;
        }

        .control.active>.dropdown .popup li:first-child {
          border-top: none;
          margin-top: 0;
        }

        .control.active>.dropdown .popup li:last-child {
          border-bottom: none;
          margin-bottom: 6px;
        }

        .control.active>.dropdown .popup a {
          margin: 4px 0;
          display: block;
          text-decoration: none;

          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
          border: 1px solid #111;

          background: -webkit-linear-gradient(top, #565656 22.5%, #4A4A4A 100.0%);
          background: -moz-linear-gradient(top, #565656 22.5%, #4A4A4A 100.0%);
          background: linear-gradient(top, #565656 22.5%, #4A4A4A 100.0%);

          -webkit-box-shadow: 0px -0px 2px #222, inset 0px -2px 3px #616161;
          -moz-box-shadow: 0px -0px 2px #222, inset 0px -2px 3px #616161;
          box-shadow: 0px -0px 2px #222, inset 0px -2px 3px #616161;
          text-indent: 0px;
          color: #FFFFFF;
          text-shadow: #3C3C3C 0px -1px 0px;
          line-height: 2em;
        }

        .control.active>.dropdown .popup a:hover {
          background: -webkit-gradient(linear, left top, left bottom, color-stop(0.2, #4E4E4E), color-stop(1.0, #4A4A4A));

          background: -webkit-linear-gradient(top, #4E4E4E 18.6%, #4A4A4A 100.0%);
          background: -moz-linear-gradient(top, #4E4E4E 18.6%, #4A4A4A 100.0%);
          background: linear-gradient(top, #4E4E4E 18.6%, #4A4A4A 100.0%);
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
          transition: opacity 0.5s;
        }

        .control:not(.active)>input[type="text"],
        .control:not(.active)>textarea {
          opacity: 0;
        }

        .control.no-strokes>input[type],
        .control.no-strokes>textarea {
          opacity: 1;
        }

        .icr {
          position: absolute;
          width: 100%;
          height: 100%;
          color: navy;
          text-align: right;
          font-size: 0.7rem;
          font-weight: bold;
          transition: opacity 0.3s;
        }

        .control.active>.icr,
        .control.no-strokes>.icr {
          transition: opacity 0.3s;
          opacity: 0;
        }
      </style>

      <div id="control_[[controlDef.id]]" class\$="control [[_hasStrokesClass()]]" style="left: [[controlDef.bounds.x]]px; top: [[controlDef.bounds.y]]px; width: [[controlDef.bounds.width]]px; height: [[controlDef.bounds.height]]px; z-index: [[_getZIndex()]];">
        <!-- Render background image -->
        <!-- TODO: use PDF renderer -->
        <template is="dom-repeat" items="[[controlDef.resource]]" filter="_isPngType" as="resource">
          <img src="data:image/png;base64,[[resource.base64Content]]" style="left: 0px; top: 0px; width: [[controlDef.bounds.width]]px; height: [[controlDef.bounds.height]]px;">
        </template>

        <!-- Input controls -->
        <template is="dom-if" if="[[!_isDesignType(controlDef)]]">
          <!-- Render strokes on controls -->
          <template is="dom-if" if="[[config.enableStroke]]">
            <template is="dom-if" if="[[_hasStrokes()]]">
              <div id="control-strokes-[[controlDef.id]]" class="control-strokes" style="width: [[controlDef.bounds.width]]px; height: [[controlDef.bounds.height]]px;">
                <template is="dom-repeat" items="[[controlData.input]]" as="input">
                  <dp-strokes-svg input="[[input]]" ,="" x="[[controlDef.bounds.x]]" y="[[controlDef.bounds.y]]"></dp-strokes-svg>
                </template>
              </div>
            </template>
          </template>
          <!-- Inputs -->
          <template is="dom-if" if="[[config.enableInput]]">
            <!-- Render Dropdown on controls -->
            <template is="dom-if" if="[[_hasScore()]]">
              <div id="dropdown-[[controlDef.id]]" class="dropdown" style="width: [[controlDef.bounds.width]]px; top: [[controlDef.bounds.height]]px;" on-mouseleave="_onMouseLeave" on-mouseenter="_onMouseEnter">
                <div class="popup compact">
                  <ul>
                    <template is="dom-repeat" items="[[_alternativeValues]]" as="alt">
                      <li><a on-mousedown="_onMouseDown">[[alt]]</a></li>
                    </template>
                  </ul>
                </div>
              </div>
            </template>

            <!-- TODO: implement autofill, dropdowns, date picker, validators... -->
            <template is="dom-if" if="[[_isTextArea(controlDef)]]">
              <!-- Text input -->
              <textarea value="[[_test]]" name="[[controlDef.name]]" id="[[controlDef.id]]" title="[[controlDef.name]]" on-mouseleave="_onMouseLeave" on-mouseenter="_onMouseEnter" on-change="_onChange" on-focus="_onFocus" on-blur="_onBlur">[[_value]]</textarea>
              <!-- Text display -->
              <div class="icr" style="color: [[_scoreColor]];">[[_value]]</div>
            </template>
            <template is="dom-if" if="[[_isTextInput(controlDef)]]">
              <!-- Text input -->
              <!-- TODO: You might want to provide a dropdown offering word/alt's instead of a simple input field -->
              <input id="input-[[controlDef.id]]" name="[[controlDef.name]]" type\$="[[_calculateInputType(controlDef.type)]]" title="[[controlDef.name]]" on-mouseleave="_onMouseLeave" on-mouseenter="_onMouseEnter" on-change="_onChange" on-focus="_onFocus" on-blur="_onBlur" value="[[_value]]">
              <!-- Text display -->
              <div class="icr" style="color: [[_scoreColor]];">[[_value]]</div>
            </template>
            <!-- Checkbox input -->
            <template is="dom-if" if="[[_isCheckbox(controlDef)]]">
              <input id="input-[[controlDef.id]]" name="[[controlDef.name]]" type\$="[[_calculateInputType(controlDef.type)]]" title="[[controlDef.name]]" on-mouseleave="_onMouseLeave" on-mouseenter="_onMouseEnter" on-change="_onChange" on-focus="_onFocus" on-blur="_onBlur" checked="[[_isCheckboxChecked()]]">
              <!--
              <template is="dom-if" if="[[_isCheckboxChecked()]]">
                <input id="input-[[controlDef.id]]" name="[[controlDef.name]]" type\$="[[_calculateInputType(controlDef.type)]]" title="[[controlDef.name]]" on-mouseleave="_onMouseLeave" on-mouseenter="_onMouseEnter" on-change="_onChange" on-focus="_onFocus" on-blur="_onBlur" checked="">
              </template>
              <template is="dom-if" if="[[!_isCheckboxChecked()]]">
                <input id="input-[[controlDef.id]]" name="[[controlDef.name]]" type\$="[[_calculateInputType(controlDef.type)]]" title="[[controlDef.name]]" on-mouseleave="_onMouseLeave" on-mouseenter="_onMouseEnter" on-change="_onChange" on-focus="_onFocus" on-blur="_onBlur">
              </template>
              -->
            </template>
          </template>
        </template>

      </div>
    `;
  }

  static get is() {
    return "dp-form-control";
  }

  ready() {
    super.ready();
    this._alternativeValues = this._getAlternativeValues();
  }

  /* Observers */

  /*_setInputMode(inputMode) {
    this._setEditorMode(inputMode);
    let icrElement = this.shadowRoot.querySelector(".icr");
    if (inputMode) {
      if (icrElement) {
        icrElement.style.display = "none";
      }
    } else {
      if (icrElement) {
        icrElement.style.display = "block";
      }
    }
  }

  _setEditorMode(editorMode) {
    let inputElements = this.shadowRoot.querySelectorAll("input, textarea");
    for (let index = 0; index < inputElements.length; index++) {
      const element = inputElements[index];
      if (element) {
        if (editorMode) {
          element.disabled = true;
        } else {
          element.disabled = false;
        }
      }
    }
  }

  _setStrokeMode(strokeMode) {
    let strokeElement = this.shadowRoot.querySelector(".control-strokes");
    if (strokeMode) {
      if (strokeElement) {
        strokeElement.style.display = "none";
      }
    } else {
      if (strokeElement) {
        strokeElement.style.display = "block";
      }
    }
  }*/

  _controlDefChanged(newValue, oldValue) {
    console.log("DpFormControl.formsetDef changed: ", newValue);
  }

  _controlDataChanged(newValue, oldValue) {
    console.log("DpFormControl.formsetData changed: ", newValue);
    this._calculateValue();
    this._calculateScoreColor();
  }

  /* Filters */

  _getZIndex() {
    if (this._isDesignType(this.controlDef)) {
      return "10";
    } else {
      return "20";
    }
  }

  _isDesignType(item) {
    return !this._isInputType(item);
  }

  _isPngType(item) {
    if (!item) {
      return false;
    }
    var type = item.type;
    if ("IMAGE_PNG" == type) {
      return true;
    }
    return false;
  }

  _isInputType(item) {
    if (!item) {
      return false;
    }
    var type = item.type;
    if (!type) {
      return false;
    }
    if ("CHARARRAY" == type) {
      return true;
    }
    if ("FREETEXT" == type) {
      return true;
    }
    if ("CHECKBOX" == type) {
      return true;
    }
    if ("IMAGE" == type) {
      return true;
    }
    return false;
  }

  _hasStrokesClass() {
    if (this._hasStrokes()) {
      return "has-strokes";
    }
    return "no-strokes";
  }

  _hasStrokes() {
    if (this.controlData && this.controlData.input) {
      for (let input of this.controlData.input) {
        for (let stroke of input.stroke) {
          return true;
        }
      }
    }
    return false;
  }

  _hasScore() {
    if (this.controlData && this.controlData.input) {
      for (let inputRunner of this.controlData.input) {
        if (inputRunner.word) {
          for (let wordRunner of inputRunner.word) {
            return true;
          }
        }
      }
      return false;
    }
  }

  // Data renderer

  _calculateValue() {
    var value = "";
    if (this.controlData && this.controlData.input) {
      for (let inputRunner of this.controlData.input) {
        if (inputRunner.word) {
          for (let wordRunner of inputRunner.word) {
            if (value.length > 0) {
              value += " ";
            }
            value += wordRunner.alt[0].value;
          }
        }
        if (inputRunner.uservalue) {
          value = inputRunner.uservalue;
        }
      }
    }
    this._value = value;
    return value;
  }

  _calculateScoreColor() {
    if (this._changed) {
      this._scoreColor = "#007f00";
    } else {
      var score = this._getScore();
      if (score == 101) {
        this._scoreColor = "#007f00";
      } else if (score <= 85) {
        this._scoreColor = "#bd0000";
      } else if (score <= 95) {
        this._scoreColor = "#7f003f";
      } else if (score <= 98) {
        this._scoreColor = "#3f007f";
      } else {
        // good:
        this._scoreColor = "#0000bd";
      }
    }
  }

  _getScore() {
    var value = 100;
    if (this.controlData && this.controlData.input) {
      for (let inputRunner of this.controlData.input) {
        if (inputRunner.word) {
          for (let wordRunner of inputRunner.word) {
            var scoreRunner = wordRunner.alt[0].score;
            if (scoreRunner < value) value = scoreRunner;
          }
        }
        if (inputRunner.uservalue) {
          return 101;
        }
      }
    }
    return value;
  }

  _getAlternativeValues() {
    var alternativeValues = new Array();
    if (this.controlData && this.controlData.input) {
      for (let inputRunner of this.controlData.input) {
        if (inputRunner.word) {
          for (let wordRunner of inputRunner.word) {
            if (wordRunner.alt) {
              for (let altRunner of wordRunner.alt) {
                alternativeValues.push(altRunner.value);
              }
            }
          }
        }
      }
    }
    return alternativeValues;
  }

  _isCheckboxChecked() {
    var boolValue = false;
    if (this.controlData && this.controlData.input) {
      for (let inputRunner of this.controlData.input) {
        if (inputRunner.boolValue) {
          boolValue = inputRunner.boolValue;
        }
      }
    }
    return boolValue;
  }

  /* Helper */

  _calculateInputType(type) {
    if ("CHARARRAY" == type) {
      return "text";
    }
    if ("FREETEXT" == type) {
      return "text";
    }
    if ("CHECKBOX" == type) {
      return "checkbox";
    }
    return "text";
  }

  _isTextInput(input) {
    return (
      input.type == "CHARARRAY" ||
      (input.type == "FREETEXT" && (!input.linecount || input.linecount < 2))
    );
  }

  _isTextArea(input) {
    return input.linecount > 1;
  }

  _isCheckbox(input) {
    return input.type == "CHECKBOX";
  }

  _fireChangeEvent(element) {
    if ("createEvent" in document) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      element.dispatchEvent(evt);
    } else {
      element.fireEvent("onchange");
    }
  }

  _setControlStrokeHeight() {
    let controlStrokesElem = this.shadowRoot.querySelector(".control-strokes");
    if (controlStrokesElem) {
      controlStrokesElem.style.top = "-" + this.controlDef.bounds.height + "px";
    }
  }

  _resetControlStrokeHeight() {
    let controlStrokesElem = this.shadowRoot.querySelector(".control-strokes");
    if (controlStrokesElem && !this._hasFocus) {
      controlStrokesElem.style.top = "0px";
    }
  }

  /* Manage input and store to newFormsetData */

  _onFocus(ev) {
    console.log("Focus: ", ev.target);
    this._setControlStrokeHeight();
    this._hasFocus = true;
    ev.target.parentElement.classList.add("active");
    ev.target.parentElement.style.zIndex = parseInt(ev.target.parentElement.style.zIndex) + 1;
    var dropdownElem = this.shadowRoot.querySelector(".dropdown");
    if (dropdownElem) {
      dropdownElem.style.display = "block";
    }
  }

  _onBlur(ev) {
    console.log("Blur: ", ev.target);
    this._resetControlStrokeHeight();
    this._hasFocus = false;
    ev.target.parentElement.style.zIndex = parseInt(ev.target.parentElement.style.zIndex) - 1;
    ev.target.parentElement.classList.remove("active");
    var dropdownElem = this.shadowRoot.querySelector(".dropdown");
    if (dropdownElem) {
      dropdownElem.style.display = "none";
    }
  }

  _onMouseDown(ev) {
    let target = ev.composedPath()[0];
    console.log("MouseDown Value: ", target.innerText);
    let dropdownElem = this.shadowRoot.querySelector(".dropdown");
    if (dropdownElem) {
      let inputElement;
      if (
        this._isTextInput(this.controlDef) ||
        this._isCheckbox(this.controlDef)
      ) {
        inputElement = this.shadowRoot.querySelector("input");
      } else if (this._isTextArea(this.controlDef)) {
        inputElement = this.shadowRoot.querySelector("textarea");
        inputElement.value = target.innerText;
      }

      if (!inputElement) {
        dropdownElem.style.display = "none";
        return;
      }

      this._value = target.innerText;
      dropdownElem.style.display = "none";
      this._fireChangeEvent(inputElement);
    }
    dropdownElem.style.display = "none";
    ev.preventDefault();
  }

  _onMouseEnter(ev) {
    this._setControlStrokeHeight();
  }

  _onMouseLeave(ev) {
    this._resetControlStrokeHeight();
  }

  _onChange(ev) {
    var newValue = ev.target.value;
    var newBoolValue = ev.target.checked;
    if (ev.target.type == "checkbox")
      console.log("New boolean value: ", newBoolValue);
    else console.log("New value: ", newValue);
    console.log("formsetId: ", this.formsetId);
    console.log("formId: ", this.formId);
    console.log("controlId: ", this.controlDef.id);

    var formset;

    if (!this.newFormsetData) {
      formset = Object();
      formset.formsetId = this.formsetId;
      formset.form = Array();
    } else {
      formset = this.newFormsetData;
    }

    var form;
    // Look if tere is already input for this form
    for (let formCandidate of formset.form) {
      if (formCandidate.formId == this.formId) {
        form = formCandidate;
        break;
      }
    }
    // No input for this form yet
    if (!form) {
      form = Object();
      form.formId = this.formId;
      form.control = Array();
      formset.form.push(form);
    }

    var control;
    // Look if tere is already input for this control
    for (let controlCandidate of form.control) {
      if (controlCandidate.formControlId == this.controlDef.id) {
        control = controlCandidate;
        break;
      }
    }
    // No input for this control yet
    if (!control) {
      control = Object();
      control.formControlId = this.controlDef.id;
      control.input = Array();
      form.control.push(control);
    }

    // Input is always new for every changes
    var input = Object();
    if (ev.target.type == "checkbox") {
      input.boolValue = newBoolValue;
      this._changed = true;
    } else {
      input.uservalue = newValue;
      this._value = newValue;
      this._changed = true;
      this._calculateScoreColor();
    }
    input.icrEngine = "USER_INPUT";
    control.input.push(input);

    // Change property
    this.newFormsetData = formset;

    console.log("newFormsetData: ", JSON.stringify(this.newFormsetData));
    this.lastChanged = Date();
  }
}

window.customElements.define(DpFormControl.is, DpFormControl);
