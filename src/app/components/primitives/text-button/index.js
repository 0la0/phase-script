import BaseComponent from 'components/_util/base-component';
import {
  reflectCallback,
  reflectAttribute
} from 'components/_util/dom';
import style from './text-button.css';

export default class TextButton extends BaseComponent {
  static get tag() {
    return 'text-button';
  }

  constructor() {
    super(
      style,
      '<button id="button"/>',
      ['button']
    );
  }

  connectedCallback() {
    reflectCallback(this, 'click', this.dom.button);
    reflectAttribute(this, 'value', this.dom.button);
    this.dom.button.innerText = this.getAttribute('label');
  }
}
