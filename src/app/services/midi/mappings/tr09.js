import { audioEventBus } from 'services/EventBus';
import BaseMidiMapper from 'services/midi/mappings/baseMapper';
import {
  getMessageFromObject,
  getObjectFromMessage
} from 'services/midi/midiEventBus';

const NAME = 'TR-09';

const TR09_VALUES = {
  ON: 50,
  ACCENT: 80,
  OFF: 0
};

const TR09_CHANNELS = {
  BASS: 36,
  SNARE: 38,
  LOW_TOM: 43,
  MID_TOM: 47,
  HIGH_TOM: 50,
  RIM: 37,
  CLAP: 39,
  HAT: 42, // OPEN => ACCENT, CLOSED => REGULAR
  CRASH: 49,
  RIDE: 51
};

export default class Tr09 extends BaseMidiMapper {
  constructor() {
    super(NAME);
  }

  setDevice(deviceInput, deviceOutput) {
    const devicesAreSet = super.setDevice(deviceInput, deviceOutput);
    if (!devicesAreSet) { return; }

    Object.keys(TR09_CHANNELS).forEach(key => {
      const address = `${this.name}-${key}`;
      const onNext = this.buildMessageHandler(TR09_CHANNELS[key]);
      audioEventBus.subscribe({ address, onNext });
    });

    if (this.deviceInput) {
      // deviceInput.onmidimessage = event => {
      //   if (event.data.length === 1 && event.data[0] === 248) {
      //     return;
      //   }
      //   const msg = getObjectFromMessage(event.data);
      //   console.log(this.name, msg)
      // };
    }
  }

  buildMessageHandler(note) {
    const midiMessageObj = {
      command: 9,
      status: 9,
      note,
      value: TR09_VALUES.ON
    };
    const midiMessage = getMessageFromObject(midiMessageObj);

    return message => {
      // console.log('drum send at', message);
      this.deviceOutput && this.deviceOutput.send(midiMessage, message.onTime);
    };
  }
}
