import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import envelopedNoiseGenerator from 'services/audio/NoiseGenerator/EnvelopedNoise';
import DiscreteSignalParameter from './_DiscreteSignalParameter';
import { msToSec } from 'services/Math';

export default class EnvelopedNoise extends BaseUnitGenerator {
  constructor(attack, sustain, release) {
    super();
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('ENVELOPED_NOISE', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
    this.paramMap = {
      attack: new DiscreteSignalParameter(attack, msToSec),
      sustain: new DiscreteSignalParameter(sustain, msToSec),
      release: new DiscreteSignalParameter(release, msToSec),
    };
  }

  schedule(message) {
    setTimeout(() => {
      const outputs = [...this.eventModel.getOutlets()];
      const asr = {
        attack: this.paramMap.attack.getValueForTime(message.time),
        sustain: this.paramMap.sustain.getValueForTime(message.time),
        release: this.paramMap.release.getValueForTime(message.time),
      };
      envelopedNoiseGenerator(message.time.audio, asr, 1, outputs);
    });
  }

  static fromParams({ attack, sustain, release }) {
    return new EnvelopedNoise(attack, sustain, release);
  }
}
