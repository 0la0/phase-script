const commonStyles = require('./common.css');

function buildShadowDom(element, innerHTML) {
  const shadowRoot = element.attachShadow({ mode: 'open' });
  const template = document.createElement('template');
  template.innerHTML = innerHTML;
  return { shadowRoot, template };
}

function buildDomMap(root, domMap) {
  return Object.entries(domMap).reduce((dom, entry) => {
    const [key, value] = entry;
    return Object.assign(dom, { [key]: root.getElementById(value) });
  }, {});
}

export default class BaseComponent extends HTMLElement {
  constructor(style, markup, domMap) {
    super();
    this.originalText = this.innerText;
    this.originalMarkup = this.innerHTML;
    [...this.children].forEach(child => this.removeChild(child));
    const { shadowRoot, template } = buildShadowDom(this, `<style>${commonStyles}${style}</style>${markup}`);
    this.template = template;
    const fragment = this.template.content.cloneNode(true);
    this.shadowRoot.appendChild(fragment);
    this.dom = domMap ? buildDomMap(this.shadowRoot, domMap) : {};
  }

  setOnRemoveCallback(onRemoveCallback) {
    this.onRemoveCallback = onRemoveCallback;
  }

  onRemove() {
    this.onRemoveCallback && this.onRemoveCallback();
  }
}
