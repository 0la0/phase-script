import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/AudioParameter/PatchEvent';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import metronomeManager from 'services/metronome/metronomeManager';
import ContinuousOscillator from 'services/audio/synth/ContinuousOscillator';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
import SignalParameter, { InputType, } from './_SignalParameter';

export default class PatchContinuousOsc extends BaseUnitGenerator {
  constructor(frequency, waveform) {
    super();
    const defaultFrequency = this._ifNumberOr(frequency, 440);
    this.osc = new ContinuousOscillator(defaultFrequency, waveform);
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

  disconnect() {
    super.disconnect();
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  static fromParams({ frequency, waveform }) {
    return new PatchContinuousOsc(frequency, waveform);
  }
}
