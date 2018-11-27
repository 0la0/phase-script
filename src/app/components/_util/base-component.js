import commonStyles from './common.css';

function buildDomMap(shadowRoot, elements) {
  if (!elements) { return {}; }
  if (!Array.isArray(elements)) {
    throw new Error('DOM entry must be an array');
  }
  return elements.reduce((dom, id) => Object.assign(dom, { [id]: shadowRoot.getElementById(id) }), {});
}

export default class BaseComponent extends HTMLElement {
  constructor(style, markup, domMap) {
    super();
    this.originalChildren = [...this.children];
    this.originalChildren.forEach(child => this.removeChild(child));
    const styleElement = document.createElement('style');
    const markupTemplate = document.createElement('template');
    this.attachShadow({ mode: 'open' });
    styleElement.textContent = `${commonStyles}${style}`;
    markupTemplate.innerHTML = markup;
    this.shadowRoot.appendChild(styleElement);
    this.shadowRoot.appendChild(markupTemplate.content.cloneNode(true));
    this.dom = buildDomMap(this.shadowRoot, domMap);
  }

  setOnRemoveCallback(onRemoveCallback) {
    this.onRemoveCallback = onRemoveCallback;
  }

  onRemove() {
    this.onRemoveCallback && this.onRemoveCallback();
  }
}
