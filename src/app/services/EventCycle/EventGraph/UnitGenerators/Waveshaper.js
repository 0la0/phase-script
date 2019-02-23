import Waveshaper from 'services/audio/waveshaper';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

export default class PatchWaveshaper {
  constructor({ wet }) {
    this.waveshaper = new Waveshaper(wet);
    this.audioModel = new PatchAudioModel('WAVESHAPER', this.waveshaper, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  disconnect() {
    this.audioModel.disconnect();
  }

  updateParams({ wet }, time) {
    this.waveshaper.setWetLevel(wet, time.audio);
  }

  static fromParams(params) {
    return new PatchWaveshaper(params);
  }
}
