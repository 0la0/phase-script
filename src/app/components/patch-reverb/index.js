import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Reverb from 'services/audio/reverb';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';

const COMPONENT_NAME = 'patch-reverb';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {};

class PatchReverb extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.reverb = new Reverb();
    this.audioModel = new PatchAudioModel('REVERB', this.reverb, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
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
}

export default new Component(COMPONENT_NAME, PatchReverb);
