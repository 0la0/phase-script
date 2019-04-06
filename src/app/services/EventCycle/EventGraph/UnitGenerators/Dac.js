import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Dac from 'services/audio/dac';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';

class PatchDac extends BaseUnitGenerator {
  constructor() {
    super();
    this.audioModel = new PatchAudioModel('DAC', new Dac(), PATCH_EVENT.SIGNAL, PATCH_EVENT.EMPTY);
  }
  disconnect() {}
  fromParams() { return this; }
}
export default new PatchDac();
