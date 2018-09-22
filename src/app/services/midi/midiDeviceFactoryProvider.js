import MidiDeviceFactory from 'services/midi/midiDeviceFactory';
import MidiDeviceFactoryShim from 'services/midi/midiDeviceFactoryShim';

let instance;

function buildMidiFactory () {
  if (!navigator.requestMIDIAccess) {
    return Promise.resolve(new MidiDeviceFactoryShim());
  }
  return navigator.requestMIDIAccess()
    .then(midiAccess => new MidiDeviceFactory(midiAccess));
}

export default function provideMidiFactory() {
  if (!instance) {
    return buildMidiFactory()
      .then(midiDeviceFactory => {
        instance = midiDeviceFactory;
        return instance;
      })
      .catch(error => console.error(error));
  }
  else {
    return Promise.resolve(instance);
  }
}
