import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import Bitcrusher from 'services/audio/Bitcrusher';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import SignalParameter, { InputType, } from 'services/AudioParameter/SignalParameter';

export default class PatchChorus extends BaseUnitGenerator {
  constructor({ bitDepth, freqReduction, wet, }) {
    super();
    const defaultBitDepth = this._ifNumberOr(bitDepth, 8);
    const defaultFreqReduction = this._ifNumberOr(freqReduction, 0.5);
    const defaultWet = this._ifNumberOr(wet, 0.5);
    this.bitcrusher = new Bitcrusher(defaultBitDepth, defaultFreqReduction, defaultWet);
    this.audioModel = new UgenConnection('BITCRUSHER', this.bitcrusher, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
    this.paramMap = {
      bitDepth: new SignalParameter(this.bitcrusher.getBitDepthParam(), defaultBitDepth, new InputType().numeric().message().build()),
      freqReduction: new SignalParameter(this.bitcrusher.getFrequencyReductionParam(), defaultFreqReduction, new InputType().numeric().message().build()),
      wet: new SignalParameter(this.bitcrusher.getWetParam(), defaultWet, new InputType().numeric().message().build()),
    };
  }

  static fromParams(params) {
    return new PatchChorus(params);
  }
}
