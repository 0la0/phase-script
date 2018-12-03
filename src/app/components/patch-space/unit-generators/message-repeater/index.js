import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import metronomeManager from 'services/metronome/metronomeManager';
import getTimeSchedules from 'services/MessageRepeat/RepeatStrategy';

const COMPONENT_NAME = 'message-repeater';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class MessageRepeater extends BaseComponent {
  constructor() {
    super(style, markup);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('Repeater', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.params = {
      numRepeats: 1,
      repeatFrequency: 1,
      repeatModifier: 'linear'
    };
  }

  handleRepeatValue(event) {
    this.params.numRepeats = parseInt(event.target.value, 10);
  }

  handleRepeatFrequency(event) {
    this.params.repeatFrequency = parseInt(event.target.value, 10);
  }

  handleRepeatModifierValue(event) {
    this.params.repeatModifier = event.target.value;
  }

  schedule(message) {
    const tickLength = metronomeManager.getMetronome().getTickLength();
    const timeSchedules = getTimeSchedules(this.params.numRepeats, this.params.repeatFrequency, this.params.repeatModifier, tickLength, message.time);
    timeSchedules.forEach((timeSchedule) =>
      this.eventModel.getOutlets().forEach(outlet =>
        outlet.schedule(message.clone().setTime(timeSchedule))));
  }
}

export default new Component(COMPONENT_NAME, MessageRepeater);
