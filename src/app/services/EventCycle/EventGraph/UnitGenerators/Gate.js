import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Gate from 'services/audio/Gate';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

export default class PatchGate extends BaseUnitGenerator {
  constructor(threshold) {
    super();
    this.gate = new Gate(threshold);
    this.audioModel = new PatchAudioModel('GATE', this.gate, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  updateParams({ threshold, }, time) {
    this.gate.setThresholdAtTime(threshold, time.audio);
  }

  static fromParams({ threshold, }) {
    return new PatchGate(threshold);
  }
}
