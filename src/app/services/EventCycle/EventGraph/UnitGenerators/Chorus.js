import Chorus from 'services/audio/chorus';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

export default class PatchChorus {
  constructor({ frequency, depth, feedback, }) {
    this.chorus = new Chorus(frequency, depth, feedback);
    this.audioModel = new PatchAudioModel('CHORUS', this.chorus, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  disconnect() {
    this.audioModel.disconnect();
  }

  updateParams({ frequency, depth, feedback, }, time) {
    this.chorus.updateParams(frequency, depth, feedback, time.audio);
  }

  static fromParams(params) {
    return new PatchChorus(params);
  }
}
