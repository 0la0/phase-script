import BaseComponent from 'common/util/base-component';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import MidiMessage from 'services/midi/MidiMessage';
import style from './midi-in-device.css';
import markup from './midi-in-device.html';

export default class MidiInDevice extends BaseComponent {
  static get tag() {
    return 'midi-in-device';
  }

  constructor(deviceName) {
    super(style, markup, [ 'label', 'messageOut' ]);
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
    if (this.isOn) {
      const message = MidiMessage.fromSerialized(event.data);
      console.log(`${this.deviceName} message`, message.toString());
    }
  }

  onToggleClick(event) {
    this.isOn = event.target.isOn;
  }
}
