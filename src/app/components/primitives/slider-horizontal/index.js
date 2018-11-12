import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import {getElementWithFunctionName} from 'components/_util/dom';

const COMPONENT_NAME = 'slider-horizontal';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class SliderHorizontal extends BaseComponent {

  constructor(note) {
    super(style, markup);
    this.isActive = false;
    this.tracker = this.shadowRoot.getElementById('tracker');
  }

  connectedCallback() {
    this.setEventListeners();
    if (this.hasAttribute('onchange')) {
      const functionName = this.getAttribute('onchange');
      const targetElement = getElementWithFunctionName(this.parentNode, functionName);
      if (targetElement) {
        this.onChange = targetElement[functionName].bind(targetElement);
      }
    }
  }

  setEventListeners() {
    this.addEventListener('mousedown', $event => {
      this.isActive = true;
      this.userEvent($event);
    });
    this.addEventListener('mouseup', $event => this.isActive = false);
    this.addEventListener('mouseout', $event => this.isActive = false);
    this.addEventListener('mousemove', $event => this.userEvent($event));
  }

  userEvent(event) {
    if (!this.isActive) { return; }
    const boundingRect = this.getBoundingClientRect();
    const normalizedPosition = event.pageX - boundingRect.left;
    let normalValue = normalizedPosition / boundingRect.width;
    normalValue = Math.max(0, Math.min(normalValue, 1)); // TODO: put into clamp function
    this.setValue(normalValue, true);
  }

  setValue(value, shouldNotify) {
    if (this.onChange && shouldNotify) {
      this.onChange(value);
    }
    this.tracker.style.setProperty('width', `${value * 100}%`);
  }

}

export default new Component(COMPONENT_NAME, SliderHorizontal);
