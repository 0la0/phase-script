import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import Waveshaper from 'services/audio/waveshaper';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import SignalParameter, { InputType, } from 'services/AudioParameter/SignalParameter';

export default class PatchWaveshaper extends BaseUnitGenerator {
  constructor({ type, wet }) {
    super();
    const defaultWet = this._ifNumberOr(wet, 0.5);
    this.waveshaper = new Waveshaper(type);
    this.audioModel = new UgenConnection('WAVESHAPER', this.waveshaper, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
    this.paramMap = {
      wet: new SignalParameter(this.waveshaper.getWetParam(), defaultWet, new InputType().numeric().message().build()),
    };
  }

  static fromParams(params) {
    return new PatchWaveshaper(params);
  }
}
