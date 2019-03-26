import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import ResFilter from 'services/audio/resFilter';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import SignalParameter, { InputType } from './_SignalParameter';

export default class PatchFilter extends BaseUnitGenerator {
  constructor({ type, frequency, q, }) {
    super();
    const defaultFrequency = typeof frequency === 'number' ? frequency : 7000;
    const defaultQ = typeof q === 'number' ? q : 1;
    this.filter = new ResFilter(type, defaultFrequency, defaultQ);
    this.audioModel = new PatchAudioModel('FILTER', this.filter, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
    this.paramMap = {
      frequency: new SignalParameter(this.filter.getFilterParam(), defaultFrequency, new InputType().numeric().message().signal().build()),
      q: new SignalParameter(this.filter.getQParam(), defaultQ, new InputType().numeric().message().signal().build()),
    };
  }

  updateParams(params, time) {
    if (!this.paramMap) {
      return;
    }
    Object.keys(params).forEach(paramKey => {
      const paramVal = params[paramKey];
      if (paramVal.constructor.name === 'DynamicParameter') {
        console.log('TODO: received dynamicParam, fix');
        return;
      }
      if (!this.paramMap[paramKey]) {
        return;
      }
      this.paramMap[paramKey].setParamValue(paramVal, time);
    });
  }

  static fromParams(params) {
    return new PatchFilter(params);
  }
}
