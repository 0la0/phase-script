import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Dac from 'services/audio/dac';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';

const COMPONENT_NAME = 'patch-dac';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {};

class PatchDac extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.dac = new Dac();
    this.audioModel = new PatchAudioModel('DAC', this.dac, PATCH_EVENT.SIGNAL, PATCH_EVENT.EMPTY);
  }

  disconnectedCallback() {
    this.dac.disconnect();
  }
}

export default new Component(COMPONENT_NAME, PatchDac);
