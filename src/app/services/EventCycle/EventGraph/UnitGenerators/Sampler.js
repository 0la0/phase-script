import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/AudioParameter/PatchEvent';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import PatchEventModel from 'services/AudioParameter/PatchEventModel';
import { playSample } from 'services/audio/sampler';
import sampleBank from 'services/audio/sampleBank';
import DiscreteSignalParameter from './_DiscreteSignalParameter';
import { msToSec } from 'services/Math';

function sampleKeyOrDefault(sampleKey) {
  if (sampleBank.getSampleKeys().includes(sampleKey)) {
    return sampleKey;
  }
  return 'hat';
}

export default class PatchSampler extends BaseUnitGenerator{
  constructor({ sampleName, attack, sustain, release, }) {
    super();
    this.sampleName = sampleName;
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('SAMPLER', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
    this.paramMap = {
      attack: new DiscreteSignalParameter(attack, msToSec),
      sustain: new DiscreteSignalParameter(sustain, msToSec),
      release: new DiscreteSignalParameter(release, msToSec),
      sampleName: new DiscreteSignalParameter(sampleName),
      modulator: {
        setParamValue: paramVal => {
          if (!(paramVal instanceof PatchAudioModel)) {
            throw new Error('Modulator must be a PatchAudioModel');
          }
          this.modulationInputs.add(paramVal.connectionFn);
        }
      },
    };
  }

  schedule(message) {
    setTimeout(() => {
      const outputs = [...this.eventModel.getOutlets()];
      const note = message.note !== undefined ? message.note : 60;
      const sampleKey = sampleKeyOrDefault(this.sampleName);
      const asr = {
        attack: this.paramMap.attack.getValueForTime(message.time),
        sustain: this.paramMap.sustain.getValueForTime(message.time),
        release: this.paramMap.release.getValueForTime(message.time),
      };
      playSample(sampleKey, message.time.audio, 0, note, asr, outputs);
    });
  }

  static fromParams(params) {
    return new PatchSampler(params);
  }
}
