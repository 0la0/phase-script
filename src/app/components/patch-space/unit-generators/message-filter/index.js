import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import ParamScheduler from 'components/patch-space/modules/ParamScheduler';
import PatchParam, { PatchParamModel } from 'components/patch-param';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';

const COMPONENT_NAME = 'message-filter';
const markup = require(`./${COMPONENT_NAME}.html`);

class MessageMap extends BaseComponent {
  constructor() {
    super('', markup, ['filterInput']);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MsgFilter', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.params = {
      threshold: 1.0
    };
    this.paramScheduler = {
      threshold: new ParamScheduler(message => message.note / 127),
    };
  }

  connectedCallback() {
    this.thresholdParam = new PatchParam.element(new PatchParamModel({
      defaultValue: this.params.threshold,
      setValue: val => this.params.threshold = val,
      setValueFromMessage: message => this.paramScheduler.threshold.schedule(message),
    }));
    this.shadowRoot.appendChild(this.thresholdParam);
  }

  schedule(message) {
    setTimeout(() => {
      const params = this.getParametersForTime(message.time.audio);
      if (Math.random() > params.threshold) { return; }
      this.eventModel.getOutlets().forEach(outlet => outlet.schedule(message));
    });
  }

  getParametersForTime(time) {
    return {
      threshold: this.paramScheduler.threshold.getValueForTime(time) || this.params.threshold,
    };
  }
}

export default new Component(COMPONENT_NAME, MessageMap);