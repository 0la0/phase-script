import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';

const markup = '<text-input id="threshInput" type="number" change="handleThresholdChange"></text-input>';
const DEFAULT_VALUE = 4;

class MessageThreshold extends BaseComponent {
  constructor() {
    super('', markup, ['threshInput']);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MsgThresh', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.threshold = DEFAULT_VALUE;
    this.messageCount = 0;
  }

  connectedCallback() {
    this.dom.threshInput.setAttribute('value', this.threshold);
  }

  schedule(message) {
    if (++this.messageCount % this.threshold !== 0) { return; }
    this.eventModel.getOutlets().forEach(outlet => outlet.schedule(message));
  }

  handleThresholdChange(event) {
    this.threshold = parseInt(event.target.value, 10);
  }

  // TODO: clear local values on metronome start / stop
}

export default new Component('message-threhold', MessageThreshold);
