import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Waveshaper from 'services/audio/waveshaper';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';

const COMPONENT_NAME = 'patch-waveshaper';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  waveSelector: 'waveSelector',
};

class PatchWaveshaper extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.waveshaper = new Waveshaper();
    this.audioModel = {
      type: 'WAVESHAPER',
      connectTo: model => this.waveshaper.connect(model.provideModel()),
      provideModel: () => this.waveshaper.getInput(),
    };
  }

  connectedCallback() {
    this.waveshaper.getCarrierFunctions()
      .map((waveType) => {
        // <option value="SINE">sin</option>
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', waveType);
        optionElement.innerText = waveType;
        return optionElement;
      })
      .forEach(ele => this.dom.waveSelector.appendChild(ele));
  }

  connectTo(node) {
    this.waveshaper.connect(node);
  }

  onTypeChange(waveType) {
    this.waveshaper.setCarrierFunction(waveType);
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

export default new Component(COMPONENT_NAME, PatchWaveshaper);
