let instance;

class MidiDeviceFactory {
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

class MidiDeviceFactoryShim {
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

function buildMidiFactory () {
  if (!navigator.requestMIDIAccess) {
    return Promise.resolve(new MidiDeviceFactoryShim());
  }
  return navigator.requestMIDIAccess()
    .then(midiAccess => new MidiDeviceFactory(midiAccess));
}

export default function provideMidiFactory() {
  if (instance) {
    return Promise.resolve(instance);
  }
  else {
    return buildMidiFactory()
      .then(midiDeviceFactory => {
        instance = midiDeviceFactory;
        return instance;
      })
      .catch(error => console.error(error));
  }
}
