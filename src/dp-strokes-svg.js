import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class DpStrokesSvg extends PolymerElement {
  static get template() {
    return `
    <style>
      img {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
    </style>

    <img class="strokes" src="[[_getSvg(input, formDef.papersize.x, formDef.papersize.y)]]" alt="svg">
`;
  }

  static get is() {
    return 'dp-strokes-svg';
  }

  static get properties() {
    return {
      input: {
        type: Object
      },
      x: {
        type: Number
      },
      y: {
        type: Number
      },
      color: {
        type: String,
        value: '#333388'
      }
    };
  }

  ready() {
    super.ready();
  }

  /* Observers */

  // Stroke renderer

  _getSvg() {
    var sb = [];
    sb.push('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg">');
    for (let stroke of this.input.stroke) {
      sb.push(
        ' <polyline style="fill: none; stroke: ' + this.color + '; stroke-width: 1.3; stroke-linecap: round; stroke-linejoin: round" points="'
      );
      for (let sample of stroke.sample) {
        sb.push(' ');
        sb.push(sample.x - this.x);
        sb.push(',');
        sb.push(sample.y - this.y);
      }
      sb.push('"></polyline>');
    }
    sb.push('</svg>');
    return sb.join('');
  }
}

window.customElements.define(DpStrokesSvg.is, DpStrokesSvg);
