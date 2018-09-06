import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Delay from 'services/audio/delay';

const COMPONENT_NAME = 'patch-delay';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {};

class PatchDelay extends BaseComponent {

  constructor() {
    super(style, markup, domMap);
    this.delay = new Delay();
    this.audioModel = {
      type: 'DELAY',
      connectTo: model => this.delay.connect(model.provideModel()),
      provideModel: () => this.delay.getInput(),
    };
  }

  // TODO: Quatization
  onDelayUpdate(value) {
    this.delay.setDelayTime(value * 0.25);
  }

  onFeedbackUpdate(value) {
    this.delay.setFeedback(value);
  }

  onWetUpdate(value) {
    this.delay.setWetLevel(value);
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }

  getConnectionFeatures() {
    return {
      hasInput: true,
      hasOutput: true,
    };
  }
}

export default new Component(COMPONENT_NAME, PatchDelay);
