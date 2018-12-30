import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import './fairshop-styles.js';
import './services/zencart/fairshop-login-service.js';

/**
 * @class
 */
export class FairshopLogin extends PolymerElement {
	static get properties() {
		return {
			restUrl: {
				type: String
			},
			unauthorized: {
				type: Boolean,
				notify: true
			},
			csrf: {
				type: String,
				notify: true
			},
			toast: {
				type: Object
			},
			user: {
				type: String,
				value: 'admin'
			},
			_password: {
				type: String,
				value: 'admin'
			},
			session: {
				type: Object,
				notify: true
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
				paper-input {
					width: 30rem;
				}
			</style>

			<fairshop-login-service id="loginService" session="{{session}}" rest-url="[[restUrl]]" unauthorized="{{unauthorized}}" csrf="{{csrf}}" toast="[[toast]]" user="[[user]]" password="[[_password]]"></fairshop-login-service>

			<h1>Login</h1>
			<paper-input id="userField" label="User" value="{{user}}"></paper-input>
			<paper-input id="passwordField" label="Password" value="{{_password}}" type="password"></paper-input>
			<paper-button id="reset" on-click="_reset">Reset</paper-button>
			<paper-button id="login" on-click="_login" raised>Login</paper-button>
		`;
	}

	_login() {
		this.$.loginService.login();
	}

	_reset() {
		this.$.loginService.reset();
	}

	_loginReceived(event) {
		this.toast.text = 'Login erfolgreich für ' + this.user + '.';
		this.toast.open();
		this.csrf = event.detail.response;
		this.unauthorized = false;
		var session = {
			'user': this.user
		}
		this.session = session;
	}

	_loginFailure(event) {
		this.toast.text = 'Login fehlgeschlegen.';
		this.toast.open();
		this.csrf = null;
		this.unauthorized = false;
	}

}
customElements.define("fairshop-login", FairshopLogin);
