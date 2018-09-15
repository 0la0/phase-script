import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Osc, { OSCILATORS } from 'services/audio/synth/Osc';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';

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
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('OSC', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
  }

  connectedCallback() {
    setTimeout(() => {
      this.dom.gainSlider.setValue(this.osc.gain);
      this.onGainUpdate(this.osc.gain);
      this.dom.adsrEnvelope.setChangeCallback((param, value) => this.asr[param] = value);
    });
  }

  schedule(message) {
    const note = message.note !== undefined ? message.note : 60;
    const startTime = message.time.audio;
    const osc = new Osc(this.osc.type);
    const outputs = [...this.eventModel.getOutlets()]
    osc.playNote(note, startTime, this.asr, this.osc.gain, outputs);
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
}

export default new Component(COMPONENT_NAME, OscVoice);
