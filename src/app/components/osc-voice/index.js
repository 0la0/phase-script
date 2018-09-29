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
  frequencyInlet: 'frequencyInlet',
};
const GAIN_VALUE = 1;

class OscVoice extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.osc = {
      type: OSCILATORS.SINE,
      // gain: 0.2
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
      this.dom.adsrEnvelope.setChangeCallback((param, value) => this.asr[param] = value);
    });
  }

  schedule(message) {
    const note = message.note !== undefined ? message.note : 60;
    const startTime = message.time.audio;
    const osc = new Osc(this.osc.type);
    const outputs = [...this.eventModel.getOutlets()]
    osc.playNote(note, startTime, this.asr, GAIN_VALUE, outputs);
  }

  getOsc() {
    return this.osc;
  }

  onOscTypeChange(value) {
    this.osc.type = value
  }

  getInletCenter() {
    const boundingBox = this.dom.frequencyInlet.getBoundingClientRect();
    return {
      x: boundingBox.left + (boundingBox.width / 2),
      y: boundingBox.top + (boundingBox.height / 2),
    };
  }

  getFrequencyModel() {
    console.log('TODO: return frequency model...');
    return {
      getAudioModelInput: () => {
        
      },
    };
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, OscVoice);
