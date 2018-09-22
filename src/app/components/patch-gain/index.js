import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Gain from 'services/audio/gain';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';

const COMPONENT_NAME = 'patch-gain';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const dom = {
  gainSlider: 'gainSlider'
};

class PatchGain extends BaseComponent {
  constructor() {
    super(style, markup, dom);
    this.gain = new Gain();
    this.audioModel = new PatchAudioModel('GAIN', this.gain, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  connectedCallback() {
    setTimeout(() => this.dom.gainSlider.setValue(0.8, true));
  }

  onGainUpdate(value) {
    this.gain.setValue(value);
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchGain);
