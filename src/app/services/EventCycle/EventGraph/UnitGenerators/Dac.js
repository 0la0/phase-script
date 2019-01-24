import Dac from 'services/audio/dac';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

export default class PatchDac {
  constructor() {
    this.type = 'DAC';
    this.dac = new Dac();
    this.audioModel = new PatchAudioModel('DAC', this.dac, PATCH_EVENT.SIGNAL, PATCH_EVENT.EMPTY);
  }

  disconnect() {
    this.audioModel.disconnect();
  }

  static fromParams() {
    return new PatchDac();
  }
}
