import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `
  <dom-module id="fairshop-styles">
    <template>
      <style>
        * {
          box-sizing: border-box;
          font-family: 'Roboto', sans-serif;
          line-height: 1.5rem;
          color: var(--secondary-text-color);
        }
        h1,
        h2,
        h3 {
          font-weight: 400;
          color: var(--primary-text-color);
        }
        paper-button,
        paper-icon-button {
					background-color: var(--paper-grey-50);
				}
      </style>
    </template>
  </dom-module>
`;

document.head.appendChild($_documentContainer.content);
