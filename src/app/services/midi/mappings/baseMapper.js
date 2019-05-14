
export default class BaseMidiMapper {
  constructor(name) {
    this.name = name;
  }

  setDevice(deviceInput, deviceOutput) {
    if (!deviceInput || !deviceOutput) {
      console.log(`${this.name}: no connections`); // eslint-disable-line no-console
      return false;
    }
    if (deviceInput === this.deviceInput && deviceOutput === this.deviceOutput) {
      console.log(`${this.name}: already connected`); // eslint-disable-line no-console
      return false;
    }
    this.deviceInput = deviceInput;
    this.deviceOutput = deviceOutput;
    return true;
  }

  getName() {
    return this.name;
  }

  destroy() {
    console.log('TODO: release', this.deviceInput, this.deviceOutput); // eslint-disable-line no-console
  }
}
