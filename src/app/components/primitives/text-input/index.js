import BaseComponent from 'components/_util/base-component';
import {
  reflectAttribute,
  reflectCallback
} from 'components/_util/dom';
import style from './text-input.css';

export default class TextInput extends BaseComponent {
  static get tag() {
    return 'text-input';
  }

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
