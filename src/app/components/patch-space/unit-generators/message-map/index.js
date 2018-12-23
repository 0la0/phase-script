import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';

const markup = '<text-input id="threshInput" type="number" value="0" change="handleMapChange"></text-input>';

class MessageMap extends BaseComponent {
  constructor() {
    super('', markup, ['mapInput']);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MsgMap', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.mapValue = 0;
  }

  schedule(message) {
    this.eventModel.getOutlets().forEach(outlet =>
      outlet.schedule(message.clone().setNote(message.note + this.mapValue)));
  }

  handleMapChange(event) {
    this.mapValue = parseInt(event.target.value, 10);
  }
}

export default new Component('message-map', MessageMap);
