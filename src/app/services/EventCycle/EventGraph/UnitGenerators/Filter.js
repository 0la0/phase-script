import ResFilter from 'services/audio/resFilter';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

export default class PatchFilter {
  constructor({ type, frequency, q, }) {
    this.filter = new ResFilter(type, frequency, q);
    this.audioModel = new PatchAudioModel('FILTER', this.filter, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  disconnect() {
    this.audioModel.disconnect();
  }

  updateParams({ frequency, q, }, time) {
    this.filter.updateParams(frequency, q, time.audio);
  }

  static fromParams(params) {
    return new PatchFilter(params);
  }
}
