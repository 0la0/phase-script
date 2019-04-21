import BaseComponent from 'common/util/base-component';
import MidiDevice from './midi-device';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import style from './midi-editor.css';
import markup from './midi-editor.html';

class MidiViewModel {
  constructor(deviceName, hasOutput, inputRef) {
    this.deviceName = deviceName;
    this.hasOutput = hasOutput;
    this.inputRef = inputRef;
  }

  getDeviceName() {
    return this.deviceName;
  }
}

export default class MidiEditor extends BaseComponent {
  static get tag() {
    return 'midi-editor';
  }

  constructor(closeCallback) {
    super(style, markup, [ 'deviceList' ]);
    this.handleClose = closeCallback;
  }

  connectedCallback() {
    this.populateSelector();
  }

  populateSelector() {
    provideMidiFactory()
      .then(midiFactory => {
        const inputDeviceNames = midiFactory.getInputList().map(device => device.name);
        const outputDeviceNames = midiFactory.getOutputList().map(device => device.name);
        const uniqueNames = new Set([].concat(inputDeviceNames, outputDeviceNames));
        return [...uniqueNames].map((deviceName) => {
          const hasOutput = outputDeviceNames.includes(deviceName);
          const inputRef = inputDeviceNames.includes(deviceName) ? midiFactory.getInputByName(deviceName) : undefined;
          return new MidiViewModel(deviceName, hasOutput, inputRef);
        });
      })
      .then(midiViewModels => this._populateDeviceList(midiViewModels));
  }

  renderNoDevices() {
    const deviceElement = document.createElement('p');
    deviceElement.classList.add('midi-device');
    deviceElement.textContent = 'No devices detected';
    this.dom.deviceList.appendChild(deviceElement);
  }

  _populateDeviceList(midiViewModels) {
    [ ...this.dom.deviceList.children ].forEach(ele => this.dom.deviceList.removeChild(ele));
    if (!midiViewModels.length) {
      return this.renderNoDevices();
    }
    midiViewModels.forEach((midiViewModel) =>
      this.dom.deviceList.appendChild(new MidiDevice(midiViewModel)));
  }
}
