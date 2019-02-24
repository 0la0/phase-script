import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import metronomeManager from 'services/metronome/metronomeManager';
// import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import ContinuousOscillator from 'services/audio/synth/ContinuousOscillator';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
// import { shorthandTypes } from 'services/audio/synth/Oscillators';

// const GAIN_VALUE = 1;

export default class PatchContinuousOsc extends BaseUnitGenerator {
  constructor({ frequency, oscType }) {
    super();
    this.osc = new ContinuousOscillator(frequency, oscType);
    this.audioModel = new PatchAudioModel('CONTINUOUS_OSC', this.osc, PATCH_EVENT.EMPTY, PATCH_EVENT.SIGNAL);
    // setTimeout(() => this.osc.start());
    this.metronomeSchedulable = new MetronomeScheduler({
      start: () => this.osc.startAtTime(),
      stop: () => this.osc.stop(),
    });
    console.log('schedulable', this.metronomeSchedulable)
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
  }

  // schedule(message) {
  //   // const note = message.note !== undefined ? message.note : 60;
  //   const outputs = [...this.eventModel.getOutlets()];
  //   envelopedOscilator(note, message.time.audio, this.asr, this.oscType, GAIN_VALUE, outputs);
  // }

  updateParams({ frequency, oscType }, time) {
    console.log('TODO: updateParams', frequency)
    this.osc.setFrequency(frequency, time.audio);
    // this.asr = {
    //   attack: attack / DIV,
    //   sustain: sustain / DIV,
    //   release: release / DIV,
    // };
    // this.oscType = shorthandTypes[oscType];
  }

  disconnect() {
    super.disconnect();
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  static fromParams(params) {
    return new PatchContinuousOsc(params);
  }
}
