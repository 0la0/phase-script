import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Osc, { OSCILATORS } from 'services/audio/synth/Osc';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';

const COMPONENT_NAME = 'osc-voice';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  adsrEnvelope: 'adsrEnvelope',
  gainOutput: 'gainOutput',
  oscTypeComboBox: 'oscTypeComboBox',
  gainSlider: 'gainSlider',
};

class OscVoice extends BaseComponent {

  constructor() {
    super(style, markup, domMap);
    this.osc = {
      type: OSCILATORS.SINE,
      gain: 0.2
    };
    this.asr = {
      attack: 0.01,
      sustain: 0.1,
      release: 0.01,
    };
    this.outlets = new Set([]);
    this.audioModel = {
      type: 'OSC', // TODO: class and type: event, receiver, audio
      connectTo: model => this.outlets.add(model),
      schedule: message => {
        const note = message.note !== undefined ? message.note : 60;
        const startTime = message.time.audio;
        const osc = new Osc(this.osc.type);
        const outputs = [...this.outlets].map(outlet => outlet.provideModel());
        osc.playNote(note, startTime, this.asr, this.osc.gain, outputs);
      },
    };
  }

  connectedCallback() {
    setTimeout(() => {
      this.dom.gainSlider.setValue(this.osc.gain);
      this.onGainUpdate(this.osc.gain);
      this.dom.adsrEnvelope.setChangeCallback((param, value) => this.asr[param] = value);
    });
  }

  onGainUpdate(value) {
    this.osc.gain = value;
    this.dom.gainOutput.innerText = value.toFixed(2);
  }

  getOsc() {
    return this.osc;
  }

  onOscTypeChange(value) {
    this.osc.type = value
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }

  getConnectionFeatures() {
    return {
      input: PATCH_EVENT.MESSAGE,
      output: PATCH_EVENT.SIGNAL,
    };
  }
}

export default new Component(COMPONENT_NAME, OscVoice);
