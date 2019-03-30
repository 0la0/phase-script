import BaseComponent from 'components/_util/base-component';
import { reflectCallback } from 'components/_util/dom';
import style from './combo-box.css';

export default class ComboBox extends BaseComponent {
  static get tag() {
    return 'combo-box';
  }

  constructor() {
    super(
      style,
      '<select id="selectBox" class="select-box"></select>',
      ['selectBox']
    );
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
