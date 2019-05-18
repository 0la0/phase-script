import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/AudioParameter/UgenConnectionType';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import AudioEventToModelAdapter from 'services/AudioParameter/AudioEventToModelAdapter';
import DiscreteSignalParameter from 'services/AudioParameter/DiscreteSignalParameter';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import MidiMessage, { COMMAND } from 'services/midi/MidiMessage';

export default class MessageMidiCcOut extends BaseUnitGenerator {
  constructor(deviceName, channel, note) {
    super();
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_MIDI_CC_OUT', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.EMPTY);
    this.paramMap = {
      deviceName: new DiscreteSignalParameter(deviceName),
      channel: new DiscreteSignalParameter(channel),
      note: new DiscreteSignalParameter(note),
    };
  }

  schedule(message) {
    setTimeout(() => {
      const deviceName = this.paramMap.deviceName.getValueForTime(message.time);
      const channel = this.paramMap.channel.getValueForTime(message.time);
      const note = this.paramMap.note.getValueForTime(message.time);
      provideMidiFactory().then(midiDeviceFactory => {
        const deviceOutput = midiDeviceFactory.getOutputByName(deviceName);
        if (!deviceOutput) {
          throw new Error(`Cannot find midi device output: ${deviceName}`);
        }
        deviceOutput.send(
          new MidiMessage(COMMAND.CONTROL_CHANGE, channel, note, message.note).serialize(),
          message.time.midi
        );
      });
    });
  }

  static fromParams({ deviceName, channel, note }) {
    return new MessageMidiCcOut(deviceName, channel, note);
  }
}
