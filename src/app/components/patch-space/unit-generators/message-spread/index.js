import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { getPosNeg, clamp } from 'components/_util/math';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import ParamScheduler from 'components/patch-space/modules/ParamScheduler';
import PatchParam, { PatchParamModel } from 'components/patch-param';

const COMPONENT_NAME = 'message-spread';
const DEFAULT_VALUES = { SPREAD: 0 };

class MessageSpread extends BaseComponent {
  constructor(options) {
    super('', '');
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('Spread', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.params = {
      spread: DEFAULT_VALUES.SPREAD,
    };
    this.paramScheduler = {
      spread: new ParamScheduler(message => message.note),
    };
  }

  connectedCallback() {
    const spreadParam = new PatchParam.element(new PatchParamModel({
      label: '',
      defaultValue: DEFAULT_VALUES.SPREAD,
      setValue: val => this.params.spread = val,
      setValueFromMessage: message => this.paramScheduler.spread.schedule(message),
      showValue: false,
    }));
    this.shadowRoot.appendChild(spreadParam);
  }

  schedule(message) {
    const spread = this.paramScheduler.spread.getValueForTime(message.time.audio) || this.params.spread;
    const spreadVal = Math.round(getPosNeg() * 24 * spread * Math.random());
    const spreadNote = message.note + spreadVal;
    const clampedNote = clamp(spreadNote, 0, 127);
    const modifiedMessage = Object.assign(message, { note: clampedNote });
    this.eventModel.getOutlets().forEach(outlet => outlet.schedule(modifiedMessage));
  }
}

export default new Component(COMPONENT_NAME, MessageSpread);
