import BaseComponent from 'common/util/base-component';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import MidiInDevice from './midi-in-device';
import style from './midi-in.css';
import markup from './midi-in.html';

export default class MidiIn extends BaseComponent {
  static get tag() {
    return 'midi-in';
  }

  constructor() {
    super(style, markup, [ 'deviceList' ]);
  }

  connectedCallback() {
    this.populateSelector();
  }

  populateSelector() {
    provideMidiFactory()
      .then(midiFactory => midiFactory.getInputList().map(device => device.name))
      .then(midiInputList => this._populateDeviceList(midiInputList));
  }

  renderNoDevices() {
    const deviceElement = document.createElement('p');
    deviceElement.classList.add('midi-device');
    deviceElement.textContent = 'No devices';
    this.dom.deviceList.appendChild(deviceElement);
  }

  _populateDeviceList(midiInputList) {
    [ ...this.dom.deviceList.children ].forEach(ele => this.dom.deviceList.removeChild(ele));
    if (!midiInputList.length) {
      return this.renderNoDevices();
    }
    midiInputList.forEach(midiIn => this.dom.deviceList.appendChild(new MidiInDevice(midiIn)));
  }
}
