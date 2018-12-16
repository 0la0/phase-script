import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import {
  reflectAttribute,
  reflectCallback
} from 'components/_util/dom';
import style from './text-input.css';

class TextInput extends BaseComponent {
  constructor() {
    super(
      style,
      '<input id="textInput" class="text-input"/>',
      ['textInput']
    );
  }

  connectedCallback() {
    reflectAttribute(this, 'type', this.dom.textInput);
    reflectAttribute(this, 'value', this.dom.textInput);
    reflectCallback(this, 'change', this.dom.textInput);
  }
}

export default new Component('text-input', TextInput);
