import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';

export default class MessageMidiNoteOut extends BaseUnitGenerator {
  constructor(deviceName) {
    super();
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_MIDI_NOTE_OUT', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.EMPTY);
    this.deviceName = deviceName;
  }

  schedule(message) {
    console.log('MessageMidiNoteOut', this.deviceName, message)
  }

  static fromParams({ deviceName, }) {
    return new MessageMidiNoteOut(deviceName);
  }
}
