import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { reflectCallback } from 'components/_util/dom';

const COMPONENT_NAME = 'combo-box';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = '<select id="selectBox" class="select-box"></select>';

class ComboBox extends BaseComponent {
  constructor() {
    super(style, markup, ['selectBox']);
  }

  connectedCallback() {
    this._setOptionElements(this.originalChildren);
    reflectCallback(this, 'change', this.dom.selectBox);
  }

  setOptions(options) {
    const optionElements = options .map((option) => {
      const optionElement = document.createElement('option');
      optionElement.setAttribute('value', option.value);
      optionElement.innerText = option.label;
      return optionElement;
    });
    this._setOptionElements(optionElements);
  }

  _setOptionElements(options) {
    while (this.dom.selectBox.firstChild) {
      this.dom.selectBox.firstChild.remove();
    }
    options.forEach(option => this.dom.selectBox.appendChild(option));
    this.dom.selectBox.setAttribute('selectedIndex', 0);
  }
}

export default new Component(COMPONENT_NAME, ComboBox);
