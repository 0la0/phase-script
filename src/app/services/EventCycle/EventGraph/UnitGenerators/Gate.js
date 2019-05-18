import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Gate from 'services/audio/Gate';
import UgenConnectinType from 'services/AudioParameter/UgenConnectionType';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';

export default class PatchGate extends BaseUnitGenerator {
  constructor(threshold) {
    super();
    this.gate = new Gate(threshold);
    this.audioModel = new PatchAudioModel('GATE', this.gate, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
  }

  updateParams({ threshold, }, time) {
    this.gate.setThresholdAtTime(threshold, time.audio);
  }

  static fromParams({ threshold, }) {
    return new PatchGate(threshold);
  }
}
