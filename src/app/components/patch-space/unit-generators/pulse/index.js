import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import OSCILATORS from 'services/audio/synth/Oscilators';
import triggerPulse from 'services/audio/pulse';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import ParamScheduler from 'services/PatchSpace/ParamScheduler';
import PatchParam, { PatchParamModel } from 'components/patch-space/patch-param';
import { mtof } from 'services/midi/util';

const COMPONENT_NAME = 'patch-pulse';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const DEFAULT_VALUES = {
  CYCLE_LENGTH: 0.2,
  RESONANCE: 8,
};

function calculateCycleLength(normalValue) {
  return Math.round(10 * normalValue);
}

function calculateResonance(normalValue) {
  return 20 * normalValue;
}

class PatchPulse extends BaseComponent {
  constructor() {
    super(style, markup);
    this.params = {
      cycleLength: DEFAULT_VALUES.CYCLE_LENGTH,
      resonance: DEFAULT_VALUES.RESONANCE,
      oscType: OSCILATORS.SINE,
    };
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('PULSE', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
    this.paramScheduler = {
      cycleLength: new ParamScheduler(message => calculateCycleLength(message.note / 127)),
      resonance: new ParamScheduler(message => calculateResonance(message.note / 127)),
    };
  }

  connectedCallback() {
    const cycleLengthParam = new PatchParam.element(new PatchParamModel({
      label: 'Length',
      defaultValue: DEFAULT_VALUES.CYCLE_LENGTH,
      setValue: val => this.params.cycleLength = calculateCycleLength(val),
      setValueFromMessage: message => this.paramScheduler.cycleLength.schedule(message),
      showValue: true,
    }));
    const resonanceParam = new PatchParam.element(new PatchParamModel({
      label: 'Res',
      defaultValue: 0.01,
      setValue: val => this.params.resonance = calculateResonance(val), //...
      setValueFromMessage: message => this.paramScheduler.cycleLength.schedule(message),
      showValue: true,
    }));
    this.shadowRoot.appendChild(cycleLengthParam);
    this.shadowRoot.appendChild(resonanceParam);
  }

  schedule(message) {
    setTimeout(() => {
      const { cycleLength, resonance } = this.getParametersForTime(message.time.audio);
      const note = message.note !== undefined ? message.note : 60;
      const frequency = mtof(note);
      const duration = cycleLength * (1 / frequency);
      const outputs = [...this.eventModel.getOutlets()];
      triggerPulse(frequency, this.params.oscType, message.time.audio, duration, resonance, outputs);
    });
  }

  getParametersForTime(time) {
    return {
      cycleLength: this.paramScheduler.cycleLength.getValueForTime(time) || this.params.cycleLength,
      resonance: this.paramScheduler.resonance.getValueForTime(time) || this.params.resonance,
    };
  }

  handleOscTypeChange(event) {
    this.params.oscType = event.target.value;
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchPulse);
