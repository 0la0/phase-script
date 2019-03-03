import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import envelopedNoiseGenerator from 'services/audio/NoiseGenerator/EnvelopedNoise';
// import { shorthandTypes } from 'services/audio/synth/Oscillators';

const GAIN_VALUE = 1;
const DIV = 1000;

export default class EnvelopedNoise extends BaseUnitGenerator {
  constructor(attack, sustain, release) {
    super();
    this.asr = {
      attack: attack / DIV,
      sustain: sustain / DIV,
      release: release / DIV,
    };
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('ENVELOPED_NOISE', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
  }

  schedule(message) {
    const note = message.note !== undefined ? message.note : 60;
    const outputs = [...this.eventModel.getOutlets()];
    envelopedNoiseGenerator(note, message.time.audio, this.asr, '', GAIN_VALUE, outputs);
  }

  updateParams({ attack, sustain, release }) {
    this.asr = {
      attack: attack / DIV,
      sustain: sustain / DIV,
      release: release / DIV,
    };
  }

  static fromParams({ attack, sustain, release }) {
    return new EnvelopedNoise(attack, sustain, release);
  }
}
