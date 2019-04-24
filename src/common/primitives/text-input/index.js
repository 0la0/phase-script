import BaseComponent from 'common/util/base-component';
import {
  reflectAttribute,
  reflectCallback
} from 'common/util/dom';
import style from './text-input.css';

const attributeReflectionList = [ 'type', 'value', 'min', 'max' ];

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
    attributeReflectionList.forEach(attributeName =>
      reflectAttribute(this, attributeName, this.dom.textInput));
    reflectCallback(this, 'change', this.dom.textInput);
  }
}
