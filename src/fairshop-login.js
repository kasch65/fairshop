import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import './fairshop-styles.js';

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

			<h1>Login</h1>
			<paper-input id="userField" label="User" value="{{user}}"></paper-input>
			<paper-input id="passwordField" label="Password" value="{{_password}}" type="password"></paper-input>
			<paper-button id="reset" on-click="_reset">Reset</paper-button>
			<paper-button id="login" on-click="_login" raised>Login</paper-button>

			<iron-ajax 
				id="requestLogin"
				url="[[restUrl]]"
				with-credentials="true"
				method="post"
				body="username=[[user]]&password=[[_password]]"
				on-response="_loginReceived"
				on-error="_loginFailure">
			</iron-ajax>
		`;
	}

	ready() {
		super.ready();
	}

	_login() {
		this.$.requestLogin.generateRequest();
	}

	_reset() {
		this.user = null;
		this._password = null;
	}

	_loginReceived(event) {
		this.toast.text = 'Login erfolgreich.';
		this.toast.open();
		this.csrf = event.detail.response;
		this.unauthorized = false;
		var session = Object();
		session.user = this.user;
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
