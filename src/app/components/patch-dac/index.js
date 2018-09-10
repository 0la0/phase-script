import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Dac from 'services/audio/dac';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';

const COMPONENT_NAME = 'patch-dac';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {};

class PatchDac extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.dac = new Dac();
    this.audioModel = {
      type: 'DAC',
      connectTo: model => console.log('connect', this, 'to', model),
      provideModel: () => this.dac.gain,
    };
  }

  disconnectedCallback() {
    this.dac.disconnect();
  }

  getConnectionFeatures() {
    return {
      input: PATCH_EVENT.SIGNAL,
      output: PATCH_EVENT.EMPTY,
    };
  }
}

export default new Component(COMPONENT_NAME, PatchDac);
