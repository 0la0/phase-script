import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import metronomeManager from 'services/metronome/metronomeManager';
import ContinuousOscillator from 'services/audio/synth/ContinuousOscillator';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';

export default class PatchContinuousOsc extends BaseUnitGenerator {
  constructor({ frequency, oscType }) {
    super();
    this.osc = new ContinuousOscillator(frequency, oscType);
    this.audioModel = new PatchAudioModel('CONTINUOUS_OSC', this.osc, PATCH_EVENT.EMPTY, PATCH_EVENT.SIGNAL);
    this.metronomeSchedulable = new MetronomeScheduler({
      start: () => this.osc.startAtTime(),
      stop: () => this.osc.stop(),
    });
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
    this.osc.startAtTime();
  }

  updateParams({ frequency }, time) {
    this.osc.setFrequency(frequency, time.audio);
  }

  disconnect() {
    super.disconnect();
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  static fromParams(params) {
    return new PatchContinuousOsc(params);
  }
}
