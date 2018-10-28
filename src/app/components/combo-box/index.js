import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { getElementWithFunctionName } from 'components/_util/dom';

const COMPONENT_NAME = 'combo-box';
const style = require(`./${COMPONENT_NAME}.css`);

class ComboBox extends BaseComponent {
  constructor() {
    super(style, '');
    this.onChangeCallback = () => {};
    this.selectBox = document.createElement('select');
    this.selectBox.setAttribute('class', 'select-box');
  }

  connectedCallback() {
    this.originalChildren.forEach(child => this.selectBox.appendChild(child));
    this.shadowRoot.appendChild(this.selectBox);
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
    this.selectBox.addEventListener('change', this.onValueChange.bind(this));
    setTimeout(() => this.onValueChange(), 20);
  }

  setCallback(onChangeCallback) {
    this.onChangeCallback = onChangeCallback;
    this.onValueChange();
  }

  setValue(value) {
    if (value === undefined || value === null) {
      this.selectBox.value = this.selectBox.firstChild.value;
      return;
    }
    this.selectBox.value = value;
  }

  setOptions(options) {
    const selectedValue = this.getSelectedValue();
    let selectIndex = 0;
    // clear dom contents
    while (this.selectBox.firstChild) {
      this.selectBox.firstChild.remove();
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
      .forEach(option => this.selectBox.appendChild(option));
    this.selectBox.selectedIndex = selectIndex;
  }

  onValueChange() {
    if (this.selectBox.selectedIndex < 0) { return; }
    this.onChangeCallback(this.getSelectedValue());
  }

  getSelectedValue() {
    if (this.selectBox.selectedIndex < 0) { return; }
    return this.selectBox[this.selectBox.selectedIndex].value;
  }
}

export default new Component(COMPONENT_NAME, ComboBox);
