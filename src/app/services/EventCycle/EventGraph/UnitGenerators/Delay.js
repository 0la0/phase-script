import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Delay from 'services/audio/delay';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import SignalParameter, { InputType, } from './_SignalParameter';
import { msToSec } from 'services/Math';

export default class PatchDelay extends BaseUnitGenerator {
  constructor({ delayMs, feedback, wet  }) {
    super();
    const defaultDelay = this._ifNumberOr(msToSec(delayMs), msToSec(120));
    const defaultFeedback = this._ifNumberOr(feedback, 0.5);
    const defaultWet = this._ifNumberOr(wet, 0.5);
    this.delay = new Delay(defaultDelay, defaultFeedback, defaultWet);
    this.audioModel = new PatchAudioModel('DELAY', this.delay, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
    this.paramMap = {
      delayMs: new SignalParameter(this.delay.getDelayParam(), defaultDelay, new InputType().numeric().message().build()),
      feedback: new SignalParameter(this.delay.getFeedbackParam(), defaultFeedback, new InputType().numeric().message().build()),
      wet: new SignalParameter(this.delay.getWetParam(), defaultWet, new InputType().numeric().message().build()),
    };
  }

  updateParams(params, time) {
    const updatedParams = Object.assign({}, params, { delayMs: msToSec(params.delayMs), });
    super.updateParams(updatedParams, time);
  }

  static fromParams(params) {
    return new PatchDelay(params);
  }
}
