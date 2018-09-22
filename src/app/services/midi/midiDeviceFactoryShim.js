export default class MidiDeviceFactoryShim {
  constructor() {
    console.log('Midi is not supported in this browser');
  }

  getInputList() {
    return [];
  }

  getOutputList() {
    return [];
  }

  getInputByName() {
    return null;
  }

  getOutputByName() {
    return null;
  }
}
