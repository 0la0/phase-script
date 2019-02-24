import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import { playSample } from 'services/audio/sampler';
import sampleBank from 'services/audio/sampleBank';

const DIV = 1000;

function sampleKeyOrDefault(sampleKey) {
  if (sampleBank.getSampleKeys().includes(sampleKey)) {
    return sampleKey;
  }
  return 'hat';
}

export default class PatchSampler extends BaseUnitGenerator{
  constructor(params) {
    super();
    this.asr = {
      attack: 0,
      sustain: 1,
      release: 0,
    };
    this.sampleName = '';
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('SAMPLER', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
    this.updateParams(params);
  }

  schedule(message) {
    const outputs = [...this.eventModel.getOutlets()];
    const note = message.note !== undefined ? message.note : 60;
    const sampleKey = sampleKeyOrDefault(this.sampleName);
    playSample(sampleKey, message.time.audio, 0, note, this.asr, outputs);
  }

  updateParams({ sampleName, attack, sustain, release }) {
    this.asr = {
      attack: attack / DIV,
      sustain: sustain / DIV,
      release: release / DIV,
    };
    this.sampleName = sampleName;
  }

  static fromParams(params) {
    return new PatchSampler(params);
  }
}
