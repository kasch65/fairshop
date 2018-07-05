import {
	PolymerElement,
	html
} from "@polymer/polymer/polymer-element";
import '@polymer/iron-input/iron-input.js';

/**
 * @class
 */
export class DPLogin extends PolymerElement {
	static get properties() {
		return {
			mandator: {
				type: String,
				value: 'EITCO',
				notify: true
			},
			user: {
				type: String,
				value: 'psadmin',
				notify: true
			},
			password: {
				type: String,
				value: 'manage',
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
			<style>
			</style>
			<h1>Login</h1>
			<table>
				<tr>
					<td>Mandant</td>
					<td><iron-input bind-value="{{mandator}}" id="mandator"><input value="{{value::mandator}}"></iron-input></td>
				</tr>
				<tr>
					<td>Benutzer</td>
					<td><iron-input bind-value="{{user}}" id="user"><input value="{{value::user}}"></iron-input></td>
				</tr>
				<tr>
					<td>Passwort</td>
					<td><iron-input bind-value="{{password}}" id="password"><input value="{{value::password}}"></iron-input></td>
				</tr>
			</table>
		`;
	}

}
customElements.define("dp-login", DPLogin);