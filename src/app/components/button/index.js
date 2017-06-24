import BaseComponent from '../_util/base-component';
import Component from '../_util/component';

const COMPONENT_NAME = 'flat-button';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const BUTTON_ACTIVE = 'button--active';

class FlatButton extends BaseComponent {

  constructor() {
    super(style, markup);
    this.isOn = false;
    this.onClick;
    this.btnElement = this.root.getElementById('button');
    this.btnElement.innerText = this.originalText;
  }

  connectedCallback() {
    if (this.hasAttribute('click')) {
      const functionName = this.getAttribute('click');
      const parent = this.parentNode.host;
      this.onClick = parent[functionName].bind(parent);
    }

    this.addEventListener('click', event => {
      if (this.onClick) {
        this.onClick()
      }
      this.isOn = !this.isOn;
      this.render();
    });
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  setState(isOn) {
    this.isOn = isOn;
  }

  render() {
    this.isOn ?
      this.btnElement.classList.add(BUTTON_ACTIVE) :
      this.btnElement.classList.remove(BUTTON_ACTIVE);
  }

}

export default new Component(COMPONENT_NAME, FlatButton);
