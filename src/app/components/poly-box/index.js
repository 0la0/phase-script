import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'poly-box';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);


class PolyBox extends BaseComponent {

  constructor() {
    super(style, markup);
  }

  connectedCallback() {}

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}


}

export default new Component(COMPONENT_NAME, PolyBox);
