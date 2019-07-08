import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {} from '@polymer/polymer/lib/utils/resolve-url.js';
import '@polymer/app-route/app-location.js';

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
			pageNr: {
				type: Number,
				value: 1,
				notify: true,
				observer: '_pageNrChanged'
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
			},
			unauthorized: {
				type: Boolean,
				observer: '_authorize'
			}
		};
	}

	/**
	 * Polymer getter for html template.
	 * @inheritDoc
	 */
	static get template() {
		return html `
			<app-location route="{{_route}}"></app-location>
		`;
	}

	static get observers() {
		return ['_routePageChanged(_route.path)']
	}

	_routePageChanged(path) {
		const url = window.location.href;
		console.log('New URL: ', window.location.href);
		// Analyze _route
		var categoryId = this._getCategoryId(url);
		var manufacturerId = this._getMaufacturerId(url);
		var productId = this._getProductId(url);

		if (this._isLogin(url)) {
			this.page = 'login';
		}
		else if (this._isCart(url)) {
			this.page = 'cart';
		}
		else if (categoryId) {
			this.categoryId = Number(categoryId);
			this.page = 'categories';
			if (productId) {
				this.productId = Number(productId);
			}
		}
		else if (this._isCategory(url)) {
			this.categoryId = null;
			this.page = 'categories';
		}
		else if (manufacturerId) {
			this.manufacturerId = Number(manufacturerId);
			this.page = 'manufacturers';
			if (productId) {
				this.productId = Number(productId);
			}
		}
		else if (this._isMaufacturer(url)) {
			this.manufacturerId = null;
			this.page = 'manufacturers';
		}
		else {
			this.page = 'home';
		}
		this.pageNr = this._getPage(url);
		this.path = this._route.path;
		return;

		var page = 'home';
		this.hrefPrefix = '/';
		if (pathTokens.length > 0 && pathTokens[0] == 'categories') {
			page = pathTokens[0];
			this.hrefPrefix += 'categories';
			if (pathTokens.length > 1) {
				categoryId = Number(pathTokens[1]);
				if (!Number.isInteger(categoryId)) {
					categoryId = null;
				}
				else {
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
		}
		else if (pathTokens.length > 0 && pathTokens[0] == 'manufacturers') {
			page = pathTokens[0];
			this.hrefPrefix += 'manufacturers';
			if (pathTokens.length > 1) {
				manufacturerId = Number(pathTokens[1]);
				if (!Number.isInteger(manufacturerId)) {
					manufacturerId = null;
				}
				else {
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
		else if (pathTokens.length > 0 && pathTokens[0] == 'cart') {
			page = pathTokens[0];
			this.hrefPrefix += 'cart';
		}
		else if (pathTokens.length > 0 && pathTokens[0] == 'login') {
			page = pathTokens[0];
			this.hrefPrefix += 'login';
		}
		this.page = page;
		this.categoryId = categoryId;
		console.log('Router.categoryId = ' + this.categoryId);
		this.manufacturerId = manufacturerId;
		console.log('Router.manufacturerId = ' + this.manufacturerId);
		this.productId = productId;
		console.log('Router.productId = ' + this.productId);
		this.path = this._route.path;
	}

	_pageNrChanged() {
		this._route.__queryParams.page = this.pageNr;
		this.notifyPath("_route.__queryParams.page");
	}

	_authorize() {
		console.log('Router: Authorization state changed to ' + this.unauthorized);
		if (this.unauthorized) {
			console.log('Router: Authorization required!');
			this._lastPage = {
				'page': this.page,
				//'path': this.path,
				'path': this._route.path
			}
			//this.page = 'login';
			this.set('_route.path', '/login');
			//this.path = '/login';
		}
		else if (this._lastPage) {
			this.page = this._lastPage.page;
			this.set('_route.path', this._lastPage.path);
			//this.path = this._lastPage.path;
		}
	}

	_getMaufacturerId(url) {
		var exp = /\/manufacturers\/(\d+)/i;
		const res = exp.exec(url);
		if (res) {
			return res[1];
		}
		return null;
	}
	
	_isMaufacturer(url) {
		var exp = /\/manufacturers(?:[\/&\?]|$)/i;
		const res = exp.exec(url);
		return Boolean(res);
	}
	
	_getCategoryId(url) {
		var exp = /\/categories\/(\d+)/i;
		const res = exp.exec(url);
		if (res) {
			return res[1];
		}
		return null;
	}
	
	_isCategory(url) {
		var exp = /\/categories(?:[\/&\?]|$)/i;
		const res = exp.exec(url);
		return Boolean(res);
	}
	
	_getProductId(url) {
		var exp = /\/product\/(\d+)/i;
		const res = exp.exec(url);
		if (res) {
			return res[1];
		}
		return null;
	}
	
	_isProduct(url) {
		var exp = /\/product(?:[\/&\?]|$)/i;
		const res = exp.exec(url);
		return Boolean(res);
	}
	
	_getPage(url) {
		var exp = /(?:\?|&)page=(\d+)/i;
		const res = exp.exec(url);
		if (res) {
			return res[1];
		}
		return 1;
	}
	
	_isLogin(url) {
		var exp = /\/login(?:[\/&\?]|$)/i;
		const res = exp.exec(url);
		return Boolean(res);
	}
	
	_isCart(url) {
		var exp = /\/cart(?:[\/&\?]|$)/i;
		const res = exp.exec(url);
		return Boolean(res);
	}
	
}
customElements.define("fairshop-router", FairshopRouter);