import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Reverb from 'services/audio/reverb';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

export default class PatchReverb extends BaseUnitGenerator {
  constructor({ attack, decay, wet }) {
    super();
    this.reverb = new Reverb(attack, decay, wet);
    this.audioModel = new PatchAudioModel('REVERB', this.reverb, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  updateParams({ attack, decay, wet }, time) {
    const scheduledTime = (time && time.audio) || 0;
    this.reverb.updateParams(attack, decay, wet, scheduledTime);
  }

  static fromParams(params) {
    return new PatchReverb(params);
  }
}
