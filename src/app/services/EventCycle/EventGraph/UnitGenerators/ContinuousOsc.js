import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import metronomeManager from 'services/metronome/metronomeManager';
import ContinuousOscillator from 'services/audio/synth/ContinuousOscillator';
import { shorthandTypes } from 'services/audio/synth/Oscillators';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
import SignalParameter, { InputType, } from './_SignalParameter';

export default class PatchContinuousOsc extends BaseUnitGenerator {
  constructor(frequency, oscType) {
    super();
    const defaultFrequency = typeof frequency === 'number' ? frequency : 440;
    this.osc = new ContinuousOscillator(defaultFrequency, shorthandTypes[oscType]);
    this.audioModel = new PatchAudioModel('CONTINUOUS_OSC', this.osc, PATCH_EVENT.EMPTY, PATCH_EVENT.SIGNAL);
    this.paramMap = {
      frequency: new SignalParameter(this.osc.getFrequencyParam(), defaultFrequency, new InputType().numeric().message().build()),
      modulator: new SignalParameter(this.osc.getFrequencyParam(), defaultFrequency, new InputType().signal().build()),
    };
    this.metronomeSchedulable = new MetronomeScheduler({
      start: () => this.osc.startAtTime(),
      stop: () => this.osc.stop(),
    });
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
    this.osc.startAtTime();
  }

  updateParams(params, time) {
    if (!this.paramMap) {
      return;
    }
    Object.keys(params).forEach((paramKey) => {
      const paramVal = params[paramKey];
      if (paramVal.constructor.name === 'DynamicParameter') {
        console.log('TODO: received dynamicParam, fix');
        return;
      }
      if (!this.paramMap[paramKey]) {
        return;
      }
      this.paramMap[paramKey].setParamValue(paramVal, time);
    });
  }

  disconnect() {
    super.disconnect();
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  static fromParams({ frequency, oscType }) {
    return new PatchContinuousOsc(frequency, oscType);
  }
}
