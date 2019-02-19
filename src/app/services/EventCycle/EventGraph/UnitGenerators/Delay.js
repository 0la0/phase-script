import Delay from 'services/audio/delay';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

function msToSec(ms) {
  return ms / 1000;
}

export default class PatchDelay {
  constructor({ delayMs, feedback, wet  }) {
    this.delay = new Delay(msToSec(delayMs), feedback, wet);
    this.audioModel = new PatchAudioModel('DELAY', this.delay, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  disconnect() {
    this.audioModel.disconnect();
  }

  updateParams({ delayMs, feedback, wet }, time) {
    this.delay.updateParams(msToSec(delayMs), feedback, wet, time.audio);
  }

  static fromParams(params) {
    return new PatchDelay(params);
  }
}
