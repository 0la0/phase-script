import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
// import Delay from 'services/audio/delay';
import Osc, { OSCILATORS } from 'services/audio/synth/Osc';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import { mtof } from 'services/midi/util';

const COMPONENT_NAME = 'patch-pulse';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  gainOutput: 'gainOutput',
  gainSlider: 'gainSlider',
  cycleLengthOutput: 'cycleLengthOutput',
  cycleLengthSlider: 'cycleLengthSlider',
  oscTypeComboBox: 'oscTypeComboBox',
};

// TODO: add bandpass / Q-value slider
class PatchPulse extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.osc = {
      type: OSCILATORS.SINE,
      gain: 0.2,
      cycleLength: 0.1,
    };
    this.asr = {
      attack: 0.001,
      sustain: 1,
      release: 0.001,
    };
    // this.pulse = new Pulse();
    // this.audioModel = new PatchAudioModel('DELAY', this.delay, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('PULSE', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
  }

  connectedCallback() {
    setTimeout(() => {
      this.dom.gainSlider.setValue(this.osc.gain);
      this.onGainUpdate(this.osc.gain);
      this.dom.cycleLengthSlider.setValue(this.osc.cycleLength);
      this.onCycleLengthUpdate(this.osc.cycleLength);
    });
  }

  schedule(message) {
    const note = message.note !== undefined ? message.note : 60;
    const period = 1 / mtof(note);
    const startTime = message.time.audio;
    const osc = new Osc(this.osc.type);
    const outputs = [...this.eventModel.getOutlets()];
    this.asr.sustain = period * this.osc.cycleLength;
    osc.playNote(note, startTime, this.asr, this.osc.gain, outputs);
    // TODO: make this a standalone service/audio/instrument
    // then pass necessary params
  }

  onGainUpdate(value) {
    this.osc.gain = value;
    this.dom.gainOutput.innerText = value.toFixed(2);
  }

  onCycleLengthUpdate(value) {
    const discreteValue = Math.round(8 * value);
    this.osc.cycleLength = discreteValue;
    this.dom.cycleLengthOutput.innerText = discreteValue;
  }

  onOscTypeChange(value) {
    this.osc.type = value
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchPulse);
