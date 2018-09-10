import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Reverb from 'services/audio/reverb';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';

const COMPONENT_NAME = 'patch-reverb';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {};

class PatchReverb extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.reverb = new Reverb();
    this.audioModel = {
      type: 'DELAY',
      connectTo: model => this.reverb.connect(model.provideModel()),
      provideModel: () => this.reverb.getInput(),
    };
  }

  onAttackUpdate(value) {
    this.reverb.setAttack(value);
  }

  onDecayUpdate(value) {
    this.reverb.setDecay(value);
  }

  onWetUpdate(value) {
    this.reverb.setWetLevel(value);
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

export default new Component(COMPONENT_NAME, PatchReverb);
