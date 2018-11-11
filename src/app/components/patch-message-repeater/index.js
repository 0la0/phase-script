import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import metronomeManager from 'services/metronome/metronomeManager';
import getTimeSchedules from './RepeatStrategy';

const COMPONENT_NAME = 'patch-message-repeater';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class PatchMessageRepeater extends BaseComponent {
  constructor() {
    super(style, markup);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('Repeater', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.params = {
      numRepeats: 0,
      repeatFrequency: 1,
      repeatModifier: 'linear'
    };
  }
  setRepeatValue(value) {
    this.params.numRepeats = parseInt(value, 10);
  }

  setRepeatFrequency(value) {
    this.params.repeatFrequency = parseInt(value, 10);
  }

  setRepeatModifierValue(value) {
    this.params.repeatModifier = value;
  }

  schedule(message) {
    const tempo = metronomeManager.getMetronome().getTempo();
    const tickLength = metronomeManager.getMetronome().getTickLength();
    const timeSchedules = getTimeSchedules(this.params.numRepeats, this.params.repeatFrequency, this.params.repeatModifier, tempo, tickLength, message.time);
    timeSchedules.forEach((timeSchedule) => {
      const modifiedMessage = { ...message, time: { ...timeSchedule } };
      this.eventModel.getOutlets().forEach(outlet => outlet.schedule(modifiedMessage));
    });
  }
}

export default new Component(COMPONENT_NAME, PatchMessageRepeater);
