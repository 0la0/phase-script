import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import {getElementWithFunctionName} from 'components/_util/dom';

const COMPONENT_NAME = 'flat-button';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const BUTTON_ACTIVE = 'button--active';

class FlatButton extends BaseComponent {

  constructor() {
    super(style, markup);
    this.isOn = false;
    this.isToggle = false;
    this.onClick;
    this.btnElement = this.root.getElementById('button');
    this.btnElement.innerText = this.originalText;
  }

  connectedCallback() {
    if (this.hasAttribute('click')) {
      const functionName = this.getAttribute('click');
      const targetElement = getElementWithFunctionName(this.parentNode, functionName);
      if (targetElement) {
        this.onClick = targetElement[functionName].bind(targetElement);
      }
    }
    if (this.hasAttribute('isToggle')) {
      this.isToggle = true;
    }

    this.addEventListener('click', event => this.trigger(true));
    this.onText = this.getAttribute('ontext') || '';
    this.offText = this.getAttribute('offtext') || '';
    this.render();
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  trigger(isFirst) {
    this.onClick();
    if (!this.isToggle) { return; }
    this.isOn = !this.isOn;
    this.render();
  }

  render() {
    this.isOn ?
      this.btnElement.classList.add(BUTTON_ACTIVE) :
      this.btnElement.classList.remove(BUTTON_ACTIVE);
    this.btnElement.innerText = this.isOn ? this.onText : this.offText;
  }

  turnOff() {
    this.isOn = false;
    this.render();
  }

}

export default new Component(COMPONENT_NAME, FlatButton);
