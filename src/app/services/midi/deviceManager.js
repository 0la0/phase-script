import provideMidiFactory from 'services/midi/midiDeviceFactory';
import Tb03 from 'services/midi/mappings/tb03';
import Tr09 from 'services/midi/mappings/tr09';

class MidiDeviceManager {
  constructor() {
    this.devices = [
      new Tr09(),
      new Tb03(),
    ];
  }

  refreshMidiConnections() {
    provideMidiFactory()
      .then(midiDeviceFactory => {
        this.devices.forEach((device) => {
          const deviceName = device.getName();
          const deviceInput = midiDeviceFactory.getInputByName(deviceName);
          const deviceOutput = midiDeviceFactory.getOutputByName(deviceName);
          device.setDevice(deviceInput, deviceOutput);
        });
      })
      .catch(error => console.log('provideMidiFactory error', error));
  }
}

const midiDeviceManager = new MidiDeviceManager();
export default midiDeviceManager;
