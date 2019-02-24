import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Gain from 'services/audio/gain';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

export default class PatchGain extends BaseUnitGenerator {
  constructor(gainValue) {
    super();
    this.gain = new Gain(gainValue);
    this.audioModel = new PatchAudioModel('GAIN', this.gain, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  updateParams({ gainValue, }, time) {
    this.gain.setValueAtTime(gainValue, time.audio);
  }

  static fromParams({ gainValue, }) {
    return new PatchGain(gainValue);
  }
}
