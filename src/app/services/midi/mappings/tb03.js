import { audioEventBus } from 'services/EventBus';
import BaseMidiMapper from 'services/midi/mappings/baseMapper';
import {
  getMessageFromObject,
  getObjectFromMessage
} from 'services/midi/midiEventBus';

const NAME = 'TB-03';

export default class Tb03 extends BaseMidiMapper {
  constructor() {
    super(NAME);
    this.onMessageFn = this.onMessage.bind(this);
  }

  setDevice(deviceInput, deviceOutput) {
    const devicesAreSet = super.setDevice(deviceInput, deviceOutput);
    if (!devicesAreSet) { return; }

    audioEventBus.subscribe({
      address: this.name,
      onNext: this.onMessageFn
    });

    if (this.deviceInput) {
    //   deviceInput.onmidimessage = event => {
    //     if (event.data.length === 1 && event.data[0] === 248) {
    //       return;
    //     }
    //     const msg = getObjectFromMessage(event.data);
    //     console.log(this.name, msg)
    //   };
    }
  }

  onMessage(message) {
    const onMessage = {
      command: 9,
      status: 1,
      note: message.note,
      value: message.value
    };
    const offMessage = {
      command: 8,
      status: 1,
      note: message.note,
      value: message.value
    };
    this.deviceOutput && this.deviceOutput.send(getMessageFromObject(onMessage), message.onTime);
    this.deviceOutput && this.deviceOutput.send(getMessageFromObject(offMessage), message.offTime);
  }
}
