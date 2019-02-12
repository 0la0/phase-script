import Reverb from 'services/audio/reverb';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

export default class PatchReverb {
  constructor({ attack, decay, wet }) {
    console.log('adw', attack, decay, wet)
    this.reverb = new Reverb(attack, decay, wet);
    this.audioModel = new PatchAudioModel('REVERB', this.reverb, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  disconnect() {
    this.audioModel.disconnect();
  }

  updateParams({ attack, decay, wet }, time) {
    const scheduledTime = (time && time.audio) || 0;
    this.reverb.updateParams(attack, decay, wet, scheduledTime);
  }

  static fromParams(params) {
    return new PatchReverb(params);
  }
}
