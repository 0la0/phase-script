import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { getElementWithFunctionName } from 'components/_util/dom';

const COMPONENT_NAME = 'combo-box';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class ComboBox extends BaseComponent {

  constructor() {
    super(style, markup);
    this.onChangeCallback = () => {};
  }

  connectedCallback() {
    if (this.hasAttribute('change')) {
      const functionName = this.getAttribute('change');
      const targetElement = getElementWithFunctionName(this.parentNode, functionName);
      if (targetElement) {
        setTimeout(() => {
          const onChange = targetElement[functionName].bind(targetElement);
          this.setCallback(onChange);
        });
      }
    }

    this.selectElement = this.root.getElementById('select-box');
    this.selectElement.innerHTML = this.originalMarkup;
    this.selectElement.addEventListener('change', this.onValueChange.bind(this));

    setTimeout(() => this.onValueChange(), 20);
  }

  setCallback(onChangeCallback) {
    this.onChangeCallback = onChangeCallback;
    this.onValueChange();
  }

  setOptions(options) {
    this.selectElement.innerHTML = '';
    options
      .map((option, index) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.innerText = option.label;
        return optionElement;
      })
      .forEach(option => this.selectElement.appendChild(option));
  }

  onValueChange() {
    if (this.selectElement.selectedIndex < 0) { return; }
    const value = this.selectElement[this.selectElement.selectedIndex].value;
    this.onChangeCallback(value);
  }

}

export default new Component(COMPONENT_NAME, ComboBox);
