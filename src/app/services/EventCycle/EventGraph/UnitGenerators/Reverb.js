import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Reverb from 'services/audio/reverb';
import UgenConnectinType from 'services/AudioParameter/UgenConnectionType';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';

export default class PatchReverb extends BaseUnitGenerator {
  constructor({ attack, decay, wet }) {
    super();
    this.reverb = new Reverb(attack, decay, wet);
    this.audioModel = new PatchAudioModel('REVERB', this.reverb, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
  }

  updateParams({ attack, decay, wet }, time) {
    const scheduledTime = (time && time.audio) || 0;
    this.reverb.updateParams(attack, decay, wet, scheduledTime);
  }

  static fromParams(params) {
    return new PatchReverb(params);
  }
}
