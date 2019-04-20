const COMMANDS = {
  NOTE_OFF: 'NOTE_OFF',
  NOTE_ON: 'NOTE_ON',
  AFTERTOUCH: 'AFTERTOUCH',
  CONTROL_CHANGE: 'CONTROL_CHANGE',
  PATCH_CHANGE: 'PATCH_CHANGE',
  CHANNEL_PRESSURE: 'CHANNEL_PRESSURE',
  PITCH_BEND: 'PITCH_BEND',
  SYSTEM_EXCLUSIVE: 'SYSTEM_EXCLUSIVE'
};

const COMMAND_REVERSE = {
  8:  COMMANDS.NOTE_OFF,
  9:  COMMANDS.NOTE_ON,
  10: COMMANDS.AFTERTOUCH,
  11: COMMANDS.CONTROL_CHANGE,
  12: COMMANDS.PATCH_CHANGE,
  13: COMMANDS.CHANNEL_PRESSURE,
  14: COMMANDS.PITCH_BEND,
  15: COMMANDS.SYSTEM_EXCLUSIVE
};

export const COMMAND = {
  [COMMANDS.NOTE_OFF]: 8,
  [COMMANDS.NOTE_ON]: 9,
  [COMMANDS.AFTERTOUCH]: 10,
  [COMMANDS.CONTROL_CHANGE]: 11,
  [COMMANDS.PATCH_CHANGE]: 12,
  [COMMANDS.CHANNEL_PRESSURE]: 13,
  [COMMANDS.PITCH_BEND]: 14,
  [COMMANDS.SYSTEM_EXCLUSIVE]: 15
};

export function getCommandString(command) {
  return COMMAND_REVERSE[command] || 'UNKNOWN';
}

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

  toString() {
    return `{ command: ${COMMAND_REVERSE[this.command]}, channel: ${this.channel}, note: ${this.note}, value: ${this.value} }`;
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
