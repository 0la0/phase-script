import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Chorus from 'services/audio/chorus';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';

const COMPONENT_NAME = 'patch-chorus';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {};

class PatchChorus extends BaseComponent {

  constructor() {
    super(style, markup, domMap);
    this.params = {
      hi: 0.5,
      mid: 0.5,
      lo: 0.5
    };
    this.chorus = new Chorus();
    this.audioModel = new PatchAudioModel('CHORUS', this.chorus, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  onFeedbackUpdate(value) {
    const feedback = value * 0.5;
    this.chorus.setFeedback(feedback);
  }

  onFreqUpdate(value) {
    const frequency = 0.1 + value * 10;
    this.chorus.setFrequency(frequency);
  }

  onDepthUpdate(value) {
    const depth = 0.0005 + value * 0.005;
    this.chorus.setDepth(depth);
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchChorus);
