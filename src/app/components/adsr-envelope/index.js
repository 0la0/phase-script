import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'adsr-envelope';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  attackSlider: 'attackSlider',
  sustainSlider: 'sustainSlider',
  releaseSlider: 'releaseSlider',
  attackOutput: 'attackOutput',
  sustainOutput: 'sustainOutput',
  releaseOutput: 'releaseOutput'
};

class AdsrEnvelope extends BaseComponent {

  constructor() {
    super(style, markup, domMap);
    this.asr = {
      attack: 0.01,
      sustain: 0.1,
      release: 0.01
    };
    this.audioModel = {
      type: 'ADSR_ENVELOPE',
      connectTo: model => console.log('connect', this, 'to', model),
    };
  }

  connectedCallback() {
    setTimeout(() => {
      this.dom.attackSlider.setValue(this.asr.attack, true);
      this.dom.sustainSlider.setValue(this.asr.sustain, true);
      this.dom.releaseSlider.setValue(this.asr.release, true);
    });
  }

  setChangeCallback(changeCallback) {
    this.changeCallback = changeCallback;
  }

  onChange(param, value) {
    if (!this.changeCallback) { return; }
    this.changeCallback(param, value);
  }

  getConnectionFeatures() {
    return {
      hasInput: true,
      hasOutput: true,
    };
  }

  onAttackUpdate(value) {
    this.asr.attack = value;
    this.onChange('attack', value);
    this.dom.attackOutput.innerText = value.toFixed(2);
  }

  onSustainUpdate(value) {
    this.asr.sustain = value;
    this.onChange('sustain', value);
    this.dom.sustainOutput.innerText = value.toFixed(2);
  }

  onReleaseUpdate(value) {
    this.asr.release = value;
    this.onChange('release', value);
    this.dom.releaseOutput.innerText = value.toFixed(2);
  }
}

export default new Component(COMPONENT_NAME, AdsrEnvelope);
