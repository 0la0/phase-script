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
    return this.getInputList()
      .find(inputDevice => inputDevice.name === deviceName);
  }

  getOutputByName(deviceName) {
    return this.getOutputList()
      .find(outputDevice => outputDevice.name === deviceName);
  }

  //TODO: remove
  getDeviceByName(deviceName) {
    return {
      input: this.getInputByName(deviceName),
      output: this.getOutputByName(deviceName)
    };
  }

}

function buildMidiFactory () {
  if (!navigator.requestMIDIAccess) {
    console.error('WebMidiApi not supported in this browser');
    return;
  }
  return navigator.requestMIDIAccess().then(
    resolveMidiAccess => new MidiDeviceFactory(resolveMidiAccess),
    error => console.error(error)
  );
}

export default buildMidiFactory;
