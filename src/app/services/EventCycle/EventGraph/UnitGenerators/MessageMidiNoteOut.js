import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/AudioParameter/UgenConnectionType';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import AudioEventToModelAdapter from 'services/AudioParameter/AudioEventToModelAdapter';
import DiscreteSignalParameter from 'services/AudioParameter/DiscreteSignalParameter';
import MidiMessage, { COMMAND } from 'services/midi/MidiMessage';
import provideMidiFactory from 'services/midi/midiDeviceFactory';

export default class MessageMidiNoteOut extends BaseUnitGenerator {
  constructor(deviceName, channel, note, duration) {
    super();
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_MIDI_NOTE_OUT', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.EMPTY);
    this.paramMap = {
      deviceName: new DiscreteSignalParameter(deviceName),
      channel: new DiscreteSignalParameter(channel),
      note: new DiscreteSignalParameter(note),
      duration: new DiscreteSignalParameter(duration),
    };
  }

  schedule(message) {
    setTimeout(() => {
      const deviceName = this.paramMap.deviceName.getValueForTime(message.time);
      const channel = this.paramMap.channel.getValueForTime(message.time);
      const note = this.paramMap.note.getValueForTime(message.time);
      const duration = this.paramMap.duration.getValueForTime(message.time);
      provideMidiFactory().then(midiDeviceFactory => {
        const deviceOutput = midiDeviceFactory.getOutputByName(deviceName);
        if (!deviceOutput) {
          throw new Error(`Cannot find midi device output: ${deviceName}`);
        }
        deviceOutput.send(
          new MidiMessage(COMMAND.NOTE_ON, channel, note, message.note).serialize(),
          message.time.midi
        );
        deviceOutput.send(
          new MidiMessage(COMMAND.NOTE_OFF, channel, note, message.note).serialize(),
          message.time.midi + duration
        );
      });
    });
  }

  static fromParams({ deviceName, channel, note, duration }) {
    return new MessageMidiNoteOut(deviceName, channel, note, duration);
  }
}
