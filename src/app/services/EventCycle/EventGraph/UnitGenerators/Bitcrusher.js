import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Bitcrusher from 'services/audio/Bitcrusher';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

export default class PatchChorus extends BaseUnitGenerator {
  constructor({ bitDepth, freqReduction, wet, }) {
    super();
    this.bitcrusher = new Bitcrusher(bitDepth, freqReduction, wet);
    this.audioModel = new PatchAudioModel('BITCRUSHER', this.bitcrusher, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  updateParams({ bitDepth, freqReduction, wet, }, time) {
    this.bitcrusher.setParamsAtTime(bitDepth, freqReduction, wet, time.audio);
  }

  static fromParams(params) {
    return new PatchChorus(params);
  }
}
