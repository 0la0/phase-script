export const COMMAND = {
  ON: 9,
  OFF: 8,
  CC: 11
};

export default class MidiMessage {
  constructor(command, channel, note, value) {
    this.command = command;
    this.channel = channel;
    this.note = note;
    this.value = value;
  }

  serialize() {
    return new Uint8Array([
      (this.command << 4) | this.channel, this.note, this.value
    ]);
  }

  static fromSerialized(serializedMessage) {
    return new MidiMessage(
      (serializedMessage[0] & '0xF0') >>> 4,
      serializedMessage[0] & '0xF',
      serializedMessage[1],
      serializedMessage[2]
    );
  }
}
