import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { clamp } from 'components/_util/math';
import { buildAttributeCallback } from 'components/_util/dom';

const COMPONENT_NAME = 'slider-horizontal';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class SliderHorizontal extends BaseComponent {
  constructor(note) {
    super(style, markup, ['tracker']);
    this.isActive = false;
  }

  connectedCallback() {
    this.onChange = buildAttributeCallback(this, 'change');
    this.setEventListeners();
  }

  setEventListeners() {
    this.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.addEventListener('mouseout', this.handleMouseUp.bind(this));
    this.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = true;
    this.userEvent(event);
  }

  handleMouseUp(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = false;
  }

  handleMouseMove(event) {
    event.preventDefault();
    event.stopPropagation();
    this.userEvent(event);
  }

  userEvent(event) {
    if (!this.isActive) { return; }
    const boundingRect = this.getBoundingClientRect();
    const normalizedPosition = event.pageX - boundingRect.left;
    const normalValue = clamp(normalizedPosition / boundingRect.width, 0, 1);
    this.setValue(normalValue);
  }

  setValue(value) {
    this.onChange(value);
    this.dom.tracker.style.setProperty('width', `${value * 100}%`);
  }
}

export default new Component(COMPONENT_NAME, SliderHorizontal);
