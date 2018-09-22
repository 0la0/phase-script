export default class MidiDeviceFactory {
  constructor(midiAccess) {
    this.midiAccess = midiAccess;
  }

  getInputList() {
    return Array.from(this.midiAccess.inputs.values());
  }

  getOutputList() {
    return Array.from(this.midiAccess.outputs.values());
  }

  getInputByName(deviceName) {
    return this.getInputList().find(inputDevice => inputDevice.name === deviceName);
  }

  getOutputByName(deviceName) {
    return this.getOutputList().find(outputDevice => outputDevice.name === deviceName);
  }
}
