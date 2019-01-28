import Dac from 'services/audio/dac';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

const dacInstance = {
  type: 'DAC',
  audioModel: new PatchAudioModel('DAC', new Dac(), PATCH_EVENT.SIGNAL, PATCH_EVENT.EMPTY),
  disconnect: () => {},
};

export default class PatchDac {
  static fromParams() {
    return dacInstance;
  }
}
