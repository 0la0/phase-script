import BaseComponent from 'common/util/base-component';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import style from './midi-out.css';
import markup from './midi-out.html';

export default class MidiOut extends BaseComponent {
  static get tag() {
    return 'midi-out';
  }

  constructor() {
    super(style, markup, [ 'deviceList' ]);
  }

  connectedCallback() {
    this.populateSelector();
  }

  populateSelector() {
    provideMidiFactory()
      .then(midiFactory => midiFactory.getOutputList().map(device => device.name))
      .then(midiOutputList => this._populateDeviceList(midiOutputList));
  }

  renderNoDevices() {
    const deviceElement = document.createElement('p');
    deviceElement.classList.add('midi-device');
    deviceElement.textContent = 'No devices';
    this.dom.deviceList.appendChild(deviceElement);
  }

  _populateDeviceList(midiOutputList) {
    [ ...this.dom.deviceList.children ].forEach(ele => this.dom.deviceList.removeChild(ele));
    if (!midiOutputList.length) {
      return this.renderNoDevices();
    }
    midiOutputList.forEach((midiOut) => {
      const deviceElement = document.createElement('p');
      deviceElement.classList.add('midi-device');
      deviceElement.textContent = midiOut;
      this.dom.deviceList.appendChild(deviceElement);
    });
  }
}
