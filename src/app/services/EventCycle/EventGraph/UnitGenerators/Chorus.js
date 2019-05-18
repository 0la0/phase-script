import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Chorus from 'services/audio/chorus';
import PATCH_EVENT from 'services/AudioParameter/PatchEvent';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';

export default class PatchChorus extends BaseUnitGenerator {
  constructor({ frequency, depth, feedback, }) {
    super();
    this.chorus = new Chorus(frequency, depth, feedback);
    this.audioModel = new PatchAudioModel('CHORUS', this.chorus, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  updateParams({ frequency, depth, feedback, }, time) {
    this.chorus.updateParams(frequency, depth, feedback, time.audio);
  }

  static fromParams(params) {
    return new PatchChorus(params);
  }
}
