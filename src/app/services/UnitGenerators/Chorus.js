import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import Chorus from 'services/audio/chorus';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';

export default class PatchChorus extends BaseUnitGenerator {
  constructor({ frequency, depth, feedback, }) {
    super();
    this.chorus = new Chorus(frequency, depth, feedback);
    this.audioModel = new UgenConnection('CHORUS', this.chorus, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
  }

  updateParams({ frequency, depth, feedback, }, time) {
    this.chorus.updateParams(frequency, depth, feedback, time.audio);
  }

  static fromParams(params) {
    return new PatchChorus(params);
  }
}
