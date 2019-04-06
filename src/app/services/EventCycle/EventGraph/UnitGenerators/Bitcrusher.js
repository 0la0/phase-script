import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Bitcrusher from 'services/audio/Bitcrusher';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import SignalParameter, { InputType, } from './_SignalParameter';

export default class PatchChorus extends BaseUnitGenerator {
  constructor({ bitDepth, freqReduction, wet, }) {
    super();
    const defaultBitDepth = this._ifNumberOr(bitDepth, 8);
    const defaultFreqReduction = this._ifNumberOr(freqReduction, 0.5);
    const defaultWet = this._ifNumberOr(wet, 0.5);
    this.bitcrusher = new Bitcrusher(defaultBitDepth, defaultFreqReduction, defaultWet);
    this.audioModel = new PatchAudioModel('BITCRUSHER', this.bitcrusher, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
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
