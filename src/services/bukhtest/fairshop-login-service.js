import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';

/**
 * @class
 */
export class FairshopLoginService extends PolymerElement {
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
				type: String
			},
			password: {
				type: String
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
			<iron-ajax 
				id="requestLogin"
				url="[[restUrl]]"
				with-credentials="true"
				method="post"
				body="username=[[user]]&password=[[password]]"
				on-response="_loginReceived"
				on-error="_loginFailure">
			</iron-ajax>
		`;
	}

	login() {
		this.$.requestLogin.generateRequest();
	}

	reset() {
		this.user = null;
		this.password = null;
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
		this.unauthorized = true;
	}

}
customElements.define("fairshop-login-service", FairshopLoginService);
