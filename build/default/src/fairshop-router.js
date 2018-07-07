import { PolymerElement, html } from "../node_modules/@polymer/polymer/polymer-element.js";
import "../node_modules/@polymer/app-route/app-location.js";
/**
 * @class
 */

export class FairshopRouter extends PolymerElement {
  static get properties() {
    return {
      _route: {
        Object
      },
      path: {
        type: String,
        notify: true
      },
      page: {
        type: String,
        value: 'home',
        notify: true
      },
      categoryId: {
        type: Number,
        value: null,
        notify: true
      },
      manufacturerId: {
        type: Number,
        value: null,
        notify: true
      },
      productId: {
        type: Number,
        value: null,
        notify: true
      },
      hrefPrefix: {
        type: String,
        notify: true
      }
    };
  }
  /**
   * Polymer getter for html template.
   * @inheritDoc
   */


  static get template() {
    return html`
			<app-location route="{{_route}}"></app-location>
		`;
  }

  static get observers() {
    return ['_routePageChanged(_route)'];
  }

  _routePageChanged(_route) {
    // Analyze _route
    var pathTokens = this._route.path.substr(1).split('/');

    var page = 'home';
    var categoryId = null;
    var manufacturerId = null;
    var productId = null;
    this.hrefPrefix = '/';

    if (pathTokens.length > 0 && pathTokens[0] == 'categories') {
      page = pathTokens[0];
      this.hrefPrefix += 'categories';

      if (pathTokens.length > 1) {
        categoryId = Number(pathTokens[1]);

        if (!Number.isInteger(categoryId)) {
          categoryId = null;
        } else {
          this.hrefPrefix += '/';
          this.hrefPrefix += categoryId;
          this.hrefPrefix += '/product';

          if (pathTokens.length > 2 && pathTokens[2] == 'product') {
            if (pathTokens.length > 3) {
              productId = Number(pathTokens[3]);

              if (!Number.isInteger(productId)) {
                productId = null;
              }
            }
          }
        }
      }
    } else if (pathTokens.length > 0 && pathTokens[0] == 'manufacturers') {
      page = pathTokens[0];
      this.hrefPrefix += 'manufacturers';

      if (pathTokens.length > 1) {
        manufacturerId = Number(pathTokens[1]);

        if (!Number.isInteger(manufacturerId)) {
          manufacturerId = null;
        } else {
          this.hrefPrefix += '/';
          this.hrefPrefix += manufacturerId;
          this.hrefPrefix += '/product';

          if (pathTokens.length > 2 && pathTokens[2] == 'product') {
            if (pathTokens.length > 3) {
              productId = Number(pathTokens[3]);

              if (!Number.isInteger(productId)) {
                productId = null;
              }
            }
          }
        }
      }
    }

    this.page = page;
    this.categoryId = categoryId;
    this.manufacturerId = manufacturerId;
    this.productId = productId;
    this.path = this._route.path;
  }

}
customElements.define("fairshop-router", FairshopRouter);