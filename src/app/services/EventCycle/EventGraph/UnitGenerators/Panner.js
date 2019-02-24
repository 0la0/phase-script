import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import StereoPanner from 'services/audio/stereoPanner';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

export default class PatchPanner extends BaseUnitGenerator {
  constructor({ panValue, }) {
    super();
    this.stereoPanner = new StereoPanner(panValue);
    this.audioModel = new PatchAudioModel('STEREO_PANNER', this.stereoPanner, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  updateParams({ panValue, }, time) {
    this.stereoPanner.setPanValue(panValue, time.audio);
  }

  static fromParams(params) {
    return new PatchPanner(params);
  }
}
