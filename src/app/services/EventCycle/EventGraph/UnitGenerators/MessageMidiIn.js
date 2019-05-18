import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/AudioParameter/PatchEvent';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import PatchEventModel from 'services/AudioParameter/PatchEventModel';
import { audioEventBus } from 'services/EventBus';
import AudioEvent from 'services/EventBus/AudioEvent';
import TimeSchedule from 'services/metronome/TimeSchedule';
import MidiMessage, { COMMAND } from 'services/midi/MidiMessage';
import provideMidiFactory from 'services/midi/midiDeviceFactory';

export default class MessageMidiIn extends BaseUnitGenerator {
  constructor(deviceName, channel, note, address) {
    super();
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_MIDI_IN', this.eventModel, PATCH_EVENT.EMPTY, PATCH_EVENT.EMPTY);
    this.channel = channel;
    this.note = note;
    this.address = address;
    this._handleMidiMessage = this.handleMidiMessage.bind(this);
    this.allowedCommands = new Set([ COMMAND.NOTE_ON, COMMAND.CONTROL_CHANGE, ]);
    provideMidiFactory().then(midiDeviceFactory => {
      this.deviceInput = midiDeviceFactory.getInputByName(deviceName);
      if (!this.deviceInput) {
        throw new Error(`Cannot find midi device input: ${deviceName}`);
      }
      this.deviceInput.addEventListener('midimessage', this._handleMidiMessage);
    });
  }

  disconnect() {
    super.disconnect();
    if (!this.deviceInput) {
      return;
    }
    this.deviceInput.removeEventListener('midimessage', this._handleMidiMessage);
  }

  handleMidiMessage(event) {
    const message = MidiMessage.fromSerialized(event.data);
    if (!this.allowedCommands.has(message.command)) {
      return;
    }
    if (message.command === COMMAND.NOTE_ON && message.value === 0) {
      return;
    }
    audioEventBus.publish(new AudioEvent(this.address, message.value, new TimeSchedule(), false));
  }

  schedule() {
    throw new Error('MidiIn cannot schedule audio events');
  }

  static fromParams({ deviceName, channel, note, address }) {
    return new MessageMidiIn(deviceName, channel, note, address);
  }
}
