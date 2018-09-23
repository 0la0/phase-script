import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'patch-param';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const dom = {
  label: 'label',
  slider: 'slider',
  output: 'output',
  paramInlet: 'paramInlet'
};

// TODO:
// * disable slider if param has input
// * accept signal input
// * if param has input, hook into global render cycle and update ui

class PatchParam extends BaseComponent {
  constructor(model) {
    super(style, markup, dom);
    this.model = model;
  }

  connectedCallback() {
    setTimeout(() => {
      this.dom.slider.setValue(this.model.defaultValue, true);
      // this.dom.slider.setValue(this.model.defaultValue, true);
      // this.dom.slider.setValue(this.model.defaultValue, true);
    });
  }

  getAudioModelInput() {
    return {
      schedule: this.schedule.bind(this),
    };
  }

  schedule(message) {
    this.model.setValueFromMessage(message);
  }

  onSliderUpdate(value) {
    this.model.setValue(value);
  }

  // TODO: move to common DOM_UTIL service or something
  getInletCenter() {
    const boundingBox = this.dom.paramInlet.getBoundingClientRect();
    return {
      x: boundingBox.left + (boundingBox.width / 2),
      y: boundingBox.top + (boundingBox.height / 2),
    };
  }
}

export default new Component(COMPONENT_NAME, PatchParam);
