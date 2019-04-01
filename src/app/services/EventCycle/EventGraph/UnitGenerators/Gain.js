import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Gain from 'services/audio/gain';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import SignalParameter, { InputType, } from './_SignalParameter';
import DynamicParameter from 'services/EventCycle/EventGraph/EventGraphFunctions/DynamicParameter';

export default class PatchGain extends BaseUnitGenerator {
  constructor(gainValue) {
    super();
    const defaultGainValue = typeof gainValue === 'number' ? gainValue : 0.8;
    this.gain = new Gain();
    this.audioModel = new PatchAudioModel('GAIN', this.gain, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
    this.paramMap = {
      gainValue: new SignalParameter(this.gain.getGainParam(), defaultGainValue, new InputType().numeric().message().signal().build()),
    };
  }

  updateParams(params, time) {
    if (!this.paramMap) {
      return;
    }
    Object.keys(params).forEach(paramKey => {
      const paramVal = params[paramKey];
      if (paramVal instanceof DynamicParameter) {
        console.log('TODO: received dynamicParam, fix');
        return;
      }
      if (!this.paramMap[paramKey]) {
        return;
      }
      this.paramMap[paramKey].setParamValue(paramVal, time);
    });
  }

  static fromParams({ gainValue, }) {
    return new PatchGain(gainValue);
  }
}
