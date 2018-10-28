const commonStyles = require('./common.css');

function buildDomMap(shadowRoot, domMap) {
  return Object.entries(domMap).reduce((dom, entry) => {
    const [key, value] = entry;
    return Object.assign(dom, { [key]: shadowRoot.getElementById(value) });
  }, {});
}

export default class BaseComponent extends HTMLElement {
  constructor(style, markup, domMap) {
    super();
    this.originalChildren = [...this.children];
    this.originalChildren.forEach(child => this.removeChild(child));

    const styleElement = document.createElement('style');
    const markupTemplate = document.createElement('template');
    const shadowRoot = this.attachShadow({ mode: 'open' });
    styleElement.textContent = `${commonStyles}${style}`;
    markupTemplate.innerHTML = markup;
    this.shadowRoot.appendChild(styleElement);
    this.shadowRoot.appendChild(markupTemplate.content.cloneNode(true));
    this.dom = domMap ? buildDomMap(this.shadowRoot, domMap) : {};
  }

  setOnRemoveCallback(onRemoveCallback) {
    this.onRemoveCallback = onRemoveCallback;
  }

  onRemove() {
    this.onRemoveCallback && this.onRemoveCallback();
  }
}
