import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { getPosNeg, clamp } from 'components/_util/math';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import ParamScheduler from 'components/patch-space/modules/ParamScheduler';
import PatchParam, { PatchParamModel } from 'components/patch-param';

const COMPONENT_NAME = 'message-map';
const markup = require(`./${COMPONENT_NAME}.html`);

class MessageMap extends BaseComponent {
  constructor(options) {
    super('', markup, ['mapInput']);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MsgMap', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.mapValue = 0;
  }

  schedule(message) {
    const modifiedMessage = {
      ...message,
      note: message.note + this.mapValue,
    };
    this.eventModel.getOutlets().forEach(outlet => outlet.schedule(modifiedMessage));
  }

  handleMapChange(event) {
    this.mapValue = parseInt(event.target.value, 10);
  }
}

export default new Component(COMPONENT_NAME, MessageMap);
