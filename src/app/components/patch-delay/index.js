import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Delay from 'services/audio/delay';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';

const COMPONENT_NAME = 'patch-delay';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {};

class PatchDelay extends BaseComponent {

  constructor() {
    super(style, markup, domMap);
    this.delay = new Delay();
    this.audioModel = new PatchAudioModel('DELAY', this.delay, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
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
}

export default new Component(COMPONENT_NAME, PatchDelay);
