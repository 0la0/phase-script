import BaseComponent from 'common/util/base-component';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import MidiMessage, { COMMAND } from 'services/midi/MidiMessage';
import { audioEventBus } from 'services/EventBus';
import AudioEvent from 'services/EventBus/AudioEvent';
import TimeSchedule from 'services/metronome/TimeSchedule';
import style from './midi-in-device.css';
import markup from './midi-in-device.html';

class LineItem {
  constructor(command, channel, note, address) {
    this.command = command;
    this.channel = channel;
    this.note = note;
    this.address = address;
  }

  setCommand(command) {
    this.command = command;
    return this;
  }

  getCommand() {
    return this.command;
  }

  setChannel(channel) {
    this.channel = channel;
    return this;
  }

  getChannel() {
    return this;
  }

  setNote(note) {
    this.note = note;
    return this;
  }

  getNote() {
    return this.note;
  }

  setAddress(address) {
    this.address = address;
    return this;
  }

  getAddress() {
    return this.address;
  }
}

export default class MidiInDevice extends BaseComponent {
  static get tag() {
    return 'midi-in-device';
  }

  constructor(deviceName) {
    super(style, markup, [ 'label', 'messageOut' ]);
    this.deviceName = deviceName;
    this.deviceInputRef;
    this.isOn = false;
    this.messageHandler = this.handleDeviceMessage.bind(this);
    this.lineItems = [
      new LineItem(COMMAND.NOTE_ON, 0, 112, 'm'),
    ];
    provideMidiFactory()
      .then(factory => factory.getInputByName(deviceName))
      .then(midiInDevice => {
        this.deviceInputRef = midiInDevice;
      });
  }

  connectedCallback() {
    this.dom.label.textContent = this.deviceName;
    if (!this.deviceInputRef) {
      return;
    }
    this.deviceInputRef.removeEventListener('midimessage', this.messageHandler);
  }

  handleDeviceMessage(event) {
    if (event.data.length === 1 && event.data[0] === 248) {
      return;
    }
    if (this.isOn) {
      this.message = MidiMessage.fromSerialized(event.data);

      this.lineItems.forEach(lineItem => {
        if (
          lineItem.command === this.message.command &&
          lineItem.channel === this.message.channel &&
          lineItem.note === this.message.note
        ) {
          if (lineItem.command === COMMAND.NOTE_ON && this.message.value === 0) {
            return;
          }
          audioEventBus.publish(new AudioEvent(lineItem.address, this.message.value, new TimeSchedule()));
        }
      });


      requestAnimationFrame(() => {
        const messageString = this.message.toString();
        this.dom.messageOut.textContent = messageString;
      });
    }
  }

  onAddLineItem() {}

  onToggleClick(event) {
    this.isOn = event.target.isOn;
    if (!this.deviceInputRef) {
      return;
    }
    if (this.isOn) {
      this.deviceInputRef.addEventListener('midimessage', this.messageHandler);
    } else {
      this.deviceInputRef.removeEventListener('midimessage', this.messageHandler);
    }
  }
}
