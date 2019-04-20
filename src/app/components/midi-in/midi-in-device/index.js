import BaseComponent from 'common/util/base-component';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import MidiMessage, { getCommandString, } from 'services/midi/MidiMessage';
import style from './midi-in-device.css';
import markup from './midi-in-device.html';

const MIDI_MESSAGE = 'midimessage';

export default class MidiInDevice extends BaseComponent {
  static get tag() {
    return 'midi-in-device';
  }

  constructor(deviceName) {
    super(style, markup, [ 'label', 'messageContainer', 'command', 'channel', 'note', 'value' ]);
    this.deviceName = deviceName;
    this.deviceInputRef;
    this.isOn = false;
    this.messageHandler = this.handleDeviceMessage.bind(this);
    this.dom.label.textContent = this.deviceName;
    provideMidiFactory()
      .then(factory => factory.getInputByName(deviceName))
      .then(midiInDevice => {
        this.deviceInputRef = midiInDevice;
      });
  }

  disconnectedCallback() {
    if (!this.deviceInputRef) {
      return;
    }
    this.deviceInputRef.removeEventListener(MIDI_MESSAGE, this.messageHandler);
  }

  handleDeviceMessage(event) {
    if (event.data.length === 1 && event.data[0] === 248) {
      return;
    }
    this.message = MidiMessage.fromSerialized(event.data);
    requestAnimationFrame(() => {
      this.dom.command.textContent = getCommandString(this.message.command);
      this.dom.channel.textContent = this.message.channel;
      this.dom.note.textContent = this.message.note;
      this.dom.value.textContent = this.message.value;
    });
  }

  onToggleClick(event) {
    this.isOn = event.target.isOn;
    if (!this.deviceInputRef) {
      return;
    }
    if (this.isOn) {
      this.deviceInputRef.addEventListener(MIDI_MESSAGE, this.messageHandler);
      this.dom.messageContainer.classList.add('message-container--visible');
    } else {
      this.deviceInputRef.removeEventListener(MIDI_MESSAGE, this.messageHandler);
      this.dom.messageContainer.classList.remove('message-container--visible');
    }
  }
}
