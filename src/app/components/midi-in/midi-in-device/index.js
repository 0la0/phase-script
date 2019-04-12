import BaseComponent from 'common/util/base-component';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import MidiMessage from 'services/midi/MidiMessage';
import style from './midi-in-device.css';
import markup from './midi-in-device.html';

class CcDelegate {
  constructor(channel) {
    this.type = 'CONTROL_CHANGE';
    this.channel = channel;
  }

  matches(message) {
    return message.command === this.type && message.channel === this.channel;
  }
}

class NoteDelegate {
  constructor(channel) {
    this.type = 'NOTE_ON';
    this.channel = channel;
  }

  matches(message) {
    return message.command === this.type
      && message.channel === this.channel
      && message.value > 0;
  }
}

const strategies = [];

export default class MidiInDevice extends BaseComponent {
  static get tag() {
    return 'midi-in-device';
  }

  constructor(deviceName) {
    super(style, markup, [ 'label', 'messageOut', 'ccContainer', 'noteContainer' ]);
    this.deviceName = deviceName;
    this.deviceInputRef;
    this.isOn = false;
    provideMidiFactory()
      .then(factory => factory.getInputByName(deviceName))
      .then(midiInDevice => {
        this.deviceInputRef = midiInDevice;
        // TODO: only assign listener if device is toggled on
        this.deviceInputRef.onmidimessage = this.handleDeviceMessage.bind(this);
      });
  }

  connectedCallback() {
    this.dom.label.textContent = this.deviceName;
  }

  handleDeviceMessage(event) {
    if (event.data.length === 1 && event.data[0] === 248) {
      return;
    }
    const message = MidiMessage.fromSerialized(event.data);
    strategies.forEach(strategy => {
      if (strategy.matches(message)) {
        console.log('do something with message!')
      }
    });
    if (this.isOn) {
      this.dom.messageOut.textContent = message.toString();
    }
  }

  onToggleClick(event) {
    this.isOn = event.target.isOn;
  }

  // TODO: ask for channel and note, then publish value
  addCcMapping() {
    const channel = prompt('enter channel [0 - 15]');
    const parent = document.createElement('div');
    const channelEle = document.createElement('p');
    channelEle.textContent = channel;
    parent.appendChild(channelEle);
    this.dom.ccContainer.appendChild(parent);
    strategies.push(new CcDelegate(channel));
  }

  // ask for channel, publish note, verify value > 0 
  addNoteMapping() {
    const channel = prompt('enter channel [0 - 15]');
    const parent = document.createElement('div');
    const channelEle = document.createElement('p');
    channelEle.textContent = channel;
    parent.appendChild(channelEle);
    this.dom.noteContainer.appendChild(parent);
    strategies.push(new NoteDelegate(channel));
  }
}
