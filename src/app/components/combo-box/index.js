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

    this.selectElement = this.shadowRoot.getElementById('select-box');
    this.selectElement.innerHTML = this.originalMarkup;
    this.selectElement.addEventListener('change', this.onValueChange.bind(this));

    setTimeout(() => this.onValueChange(), 20);
  }

  setCallback(onChangeCallback) {
    this.onChangeCallback = onChangeCallback;
    this.onValueChange();
  }

  setValue(value) {
    if (value === undefined || value === null) {
      this.selectElement.value = this.selectElement.firstChild.value;
      return;
    }
    this.selectElement.value = value;
  }

  setOptions(options) {
    const selectedValue = this.getSelectedValue();
    let selectIndex = 0;
    // clear dom contents
    while (this.selectElement.firstChild) {
      this.selectElement.firstChild.remove();
    }
    options
      .map((option, index) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.innerText = option.label;
        if (option.value === selectedValue) {
          selectIndex = index;
        }
        return optionElement;
      })
      .forEach(option => this.selectElement.appendChild(option));
    this.selectElement.selectedIndex = selectIndex;
  }

  onValueChange() {
    if (this.selectElement.selectedIndex < 0) { return; }
    this.onChangeCallback(this.getSelectedValue());
  }

  getSelectedValue() {
    if (this.selectElement.selectedIndex < 0) { return; }
    return this.selectElement[this.selectElement.selectedIndex].value;
  }
}

export default new Component(COMPONENT_NAME, ComboBox);
