const commonStyles = require('./common.css');

function buildShadowDom(element, innerHTML) {
  let shadowRoot = element.attachShadow({mode: 'open'});
  const template = document.createElement('template');
  template.innerHTML = innerHTML;
  const instance = template.content.cloneNode(true);
  shadowRoot.appendChild(instance);
  return shadowRoot;
}

function buildDomMap(root, domMap) {
  return Object.entries(domMap).reduce((dom, entry) => {
    const [key, value] = entry;
    dom[key] = root.getElementById(value);
    return dom;
  }, {});
}

export default class BaseComponent extends HTMLElement {
  constructor(style, markup, domMap) {
    super();
    this.originalText = this.innerText;
    this.originalMarkup = this.innerHTML;
    this.innerHTML = '';
    this.root = buildShadowDom(this, `<style>${commonStyles}${style}</style>${markup}`);
    this.dom = domMap ? buildDomMap(this.root, domMap) : {};
  }

  setOnRemoveCallback(onRemoveCallback) {
    this.onRemoveCallback = onRemoveCallback;
  }

  onRemove() {
    this.onRemoveCallback && this.onRemoveCallback();
  }
}
