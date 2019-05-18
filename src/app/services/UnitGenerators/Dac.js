import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import Dac from 'services/audio/dac';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';

class PatchDac extends BaseUnitGenerator {
  constructor() {
    super();
    this.audioModel = new UgenConnection('DAC', new Dac(), UgenConnectinType.SIGNAL, UgenConnectinType.EMPTY);
  }
  disconnect() {}
  fromParams() { return this; }
}
export default new PatchDac();
