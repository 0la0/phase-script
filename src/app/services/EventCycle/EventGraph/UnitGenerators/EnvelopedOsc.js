import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import envelopedOscilator from 'services/audio/synth/EnvelopedOscillator';
import { shorthandTypes } from 'services/audio/synth/Oscillators';

const GAIN_VALUE = 1;
const DIV = 1000;

export default class EnvelopedOsc extends BaseUnitGenerator {
  constructor(attack, sustain, release, oscType) {
    super();
    this.asr = {
      attack: attack / DIV,
      sustain: sustain / DIV,
      release: release / DIV,
    };
    this.oscType = shorthandTypes[oscType];
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('ENVELOPED_OSC', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
  }

  schedule(message) {
    const note = message.note !== undefined ? message.note : 60;
    const outputs = [...this.eventModel.getOutlets()];
    envelopedOscilator(note, message.time.audio, this.asr, this.oscType, GAIN_VALUE, outputs);
  }

  updateParams({ attack, sustain, release, oscType }) {
    this.asr = {
      attack: attack / DIV,
      sustain: sustain / DIV,
      release: release / DIV,
    };
    this.oscType = shorthandTypes[oscType];
  }

  static fromParams({ attack, sustain, release, oscType }) {
    return new EnvelopedOsc(attack, sustain, release, oscType);
  }
}
