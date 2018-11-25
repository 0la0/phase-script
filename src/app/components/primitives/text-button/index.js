import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import {
  reflectCallback,
  reflectAttribute
} from 'components/_util/dom';

const COMPONENT_NAME = 'text-button';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = '<button id="button"/>';

class TextButton extends BaseComponent {
  constructor() {
    super(style, markup, ['button']);
  }

  connectedCallback() {
    reflectCallback(this, 'click', this.dom.button);
    reflectAttribute(this, 'value', this.dom.button);
    this.dom.button.innerText = this.getAttribute('label');
  }
}

export default new Component(COMPONENT_NAME, TextButton);
