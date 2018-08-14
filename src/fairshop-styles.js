import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `
  <dom-module id="fairshop-styles">
    <template>
      <style>
        * {
          box-sizing: border-box;
          font-family: 'Roboto', sans-serif;
          font-weight: 400;
          line-height: 1.5rem;
          color: var(--secondary-text-color);
        }
        h1,
        h2,
        h3 {
          color: var(--primary-text-color);
        }
      </style>
    </template>
  </dom-module>
`;

document.head.appendChild($_documentContainer.content);
