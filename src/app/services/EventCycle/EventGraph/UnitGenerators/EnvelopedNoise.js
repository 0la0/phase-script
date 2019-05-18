import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/AudioParameter/UgenConnectionType';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import AudioEventToModelAdapter from 'services/AudioParameter/AudioEventToModelAdapter';
import envelopedNoiseGenerator from 'services/audio/EnvelopedNoise';
import DiscreteSignalParameter from 'services/AudioParameter/DiscreteSignalParameter';
import { msToSec } from 'services/Math';

export default class EnvelopedNoise extends BaseUnitGenerator {
  constructor(attack, sustain, release) {
    super();
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('ENVELOPED_NOISE', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.SIGNAL);
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
