import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import {
  reflectCallback,
  reflectAttribute
} from 'components/_util/dom';
import style from './text-button.css';

class TextButton extends BaseComponent {
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

export default new Component('text-button', TextButton);
