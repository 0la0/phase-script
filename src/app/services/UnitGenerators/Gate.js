import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import Gate from 'services/audio/Gate';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';

export default class PatchGate extends BaseUnitGenerator {
  constructor(threshold) {
    super();
    this.gate = new Gate(threshold);
    this.audioModel = new UgenConnection('GATE', this.gate, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
  }

  updateParams({ threshold, }, time) {
    this.gate.setThresholdAtTime(threshold, time.audio);
  }

  static fromParams({ threshold, }) {
    return new PatchGate(threshold);
  }
}
