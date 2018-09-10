import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Chorus from 'services/audio/chorus';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';

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
    this.audioModel = {
      type: 'CHORUS',
      connectTo: model => this.chorus.connect(model.provideModel()),
      provideModel: () => this.chorus.getInput(),
    };
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

  getConnectionFeatures() {
    return {
      input: PATCH_EVENT.SIGNAL,
      output: PATCH_EVENT.SIGNAL,
    };
  }
}

export default new Component(COMPONENT_NAME, PatchChorus);
