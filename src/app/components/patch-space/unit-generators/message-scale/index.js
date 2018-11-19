import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import scales from 'services/scale/scales';
import ScaleManager from 'services/scale/ScaleManager';

const COMPONENT_NAME = 'message-scale';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class MessageScale extends BaseComponent {
  constructor() {
    super(style, markup, [ 'scaleSelector', 'baseNoteInput' ]);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('Scale', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.params = { baseNote: 0 };
    this.scaleManager = new ScaleManager('major');
    this.dom.baseNoteInput.addEventListener('change', () =>
      this.params.baseNote = parseInt(this.dom.baseNoteInput.value));
  }

  connectedCallback() {
    const scaleOptions = Object.keys(scales).map(scale => ({ label: scale, value: scale }));
    setTimeout(() => {
      this.dom.scaleSelector.setOptions(scaleOptions);
    });
  }

  onScaleChange(value) {
    this.scaleManager = new ScaleManager(value);
  }

  schedule(message) {
    const note = this.scaleManager.getNearestNote(this.params.baseNote, message.note);
    console.log('baseNote', this.params.baseNote);
    const modifiedMessage = { ...message, note };
    this.eventModel.getOutlets().forEach(outlet => outlet.schedule(modifiedMessage));
  }
}

export default new Component(COMPONENT_NAME, MessageScale);
