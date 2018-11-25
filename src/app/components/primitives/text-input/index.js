import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import {
  reflectAttribute,
  reflectCallback
} from 'components/_util/dom';

const COMPONENT_NAME = 'text-input';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = '<input id="textInput" class="text-input"/>';

class TextInput extends BaseComponent {
  constructor() {
    super(style, markup, ['textInput']);
  }

  connectedCallback() {
    reflectAttribute(this, 'type', this.dom.textInput);
    reflectAttribute(this, 'value', this.dom.textInput);
    reflectCallback(this, 'change', this.dom.textInput);
  }
}

export default new Component(COMPONENT_NAME, TextInput);
