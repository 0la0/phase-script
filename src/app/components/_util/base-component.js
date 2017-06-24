
function buildShadowDom(element, innerHTML) {
  let shadowRoot = element.attachShadow({mode: 'open'});
  const template = document.createElement('template');
  template.innerHTML = innerHTML;
  const instance = template.content.cloneNode(true);
  shadowRoot.appendChild(instance);
  return shadowRoot;
}

export default class BaseComponent extends HTMLElement {

  constructor(style, markup) {
    super();
    this.originalText = this.innerText;
    this.root = buildShadowDom(this, `<style>${style}</style>${markup}`);
  }

}
