import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import Gain from 'services/audio/gain';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import SignalParameter, { InputType, } from 'services/AudioParameter/SignalParameter';

export default class PatchGain extends BaseUnitGenerator {
  constructor(gainValue) {
    super();
    const defaultGainValue = this._ifNumberOr(gainValue, 0.5);
    this.gain = new Gain();
    this.audioModel = new UgenConnection('GAIN', this.gain, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
    this.paramMap = {
      gainValue: new SignalParameter(this.gain.getGainParam(), defaultGainValue, new InputType().numeric().message().signal().build()),
    };
  }

  static fromParams({ gainValue, }) {
    return new PatchGain(gainValue);
  }
}
