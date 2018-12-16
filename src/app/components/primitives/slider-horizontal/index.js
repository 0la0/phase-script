import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { clamp } from 'services/Math';
import { buildAttributeCallback } from 'components/_util/dom';
import style from './slider-horizontal.css';

class SliderHorizontal extends BaseComponent {
  constructor() {
    super(
      style,
      '<div id="tracker" class="tracker"></div>',
      ['tracker']
    );
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

export default new Component('slider-horizontal', SliderHorizontal);
