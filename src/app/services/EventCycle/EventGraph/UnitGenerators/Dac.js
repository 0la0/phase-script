import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Dac from 'services/audio/dac';
import UgenConnectinType from 'services/AudioParameter/UgenConnectionType';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';

class PatchDac extends BaseUnitGenerator {
  constructor() {
    super();
    this.audioModel = new PatchAudioModel('DAC', new Dac(), UgenConnectinType.SIGNAL, UgenConnectinType.EMPTY);
  }
  disconnect() {}
  fromParams() { return this; }
}
export default new PatchDac();
