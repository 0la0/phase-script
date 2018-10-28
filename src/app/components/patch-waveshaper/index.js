import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Waveshaper from 'services/audio/waveshaper';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchParam from 'components/patch-param';

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
    this.audioModel = new PatchAudioModel('WAVESHAPER', this.waveshaper, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  connectedCallback() {
    this.initFunctionSelector();
    this.initParams();
  }

  initFunctionSelector() {
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

  initParams() {
    const wetModel = {
      label: 'Wet',
      defaultValue: 0.5,
      setValue: this.onWetUpdate.bind(this),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.onWetUpdate(normalValue, message.time.audio);
      },
    };
    const wetParam = new PatchParam.element(wetModel);
    this.shadowRoot.appendChild(wetParam);
  }

  connectTo(node) {
    this.waveshaper.connect(node);
  }

  onTypeChange(waveType) {
    this.waveshaper.setCarrierFunction(waveType);
  }

  onWetUpdate(value, scheduledTime = 0) {
    this.waveshaper.setWetLevel(value, scheduledTime);
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchWaveshaper);
