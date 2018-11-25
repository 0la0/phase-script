import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import {
  getElementWithFunctionName,
  reflectCallback
} from 'components/_util/dom';

const toggleButtonStyle = `
  .button--active {
    background-color: var(--color-grey-light);
    color: var(--color-black-light);
  }
`;

const COMPONENT_NAME = 'toggle-button';
const buttonStyle = require(`../text-button/text-button.css`);
const style = `${buttonStyle} ${toggleButtonStyle}`;
const markup = '<button id="button"/>';

const BUTTON_ACTIVE = 'button--active';

class ToggleButton extends BaseComponent {
  constructor() {
    super(style, markup, ['button']);
    this.isOn = false;
  }

  connectedCallback() {
    // TODO: bindAttributeToHigherOrderFunction
    if (this.hasAttribute('click')) {
      const functionName = this.getAttribute('click');
      const targetElement = getElementWithFunctionName(this.parentNode, functionName);
      if (targetElement) {
        this.onClick = targetElement[functionName].bind(targetElement);
      }
    }
    this._onClick = this.trigger.bind(this)
    this.addEventListener('click', this._onClick);
    this.onText = this.getAttribute('onlabel') || '';
    this.offText = this.getAttribute('offlabel') || '';
    this.render();
  }

  trigger(event) {
    this.onClick(event);
    this.isOn = !this.isOn;
    this.render();
  }

  render() {
    this.isOn ?
      this.dom.button.classList.add(BUTTON_ACTIVE) :
      this.dom.button.classList.remove(BUTTON_ACTIVE);
    this.dom.button.innerText = this.isOn ? this.onText : this.offText;
  }
}

export default new Component(COMPONENT_NAME, ToggleButton);
