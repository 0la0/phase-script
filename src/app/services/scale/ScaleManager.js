import scales from './scales';

export default class ScaleManager {
  constructor(scale) {
    this.scale = scales[scale];
    if (!this.scale) {
      throw new Error(`Scale ${scale} is not defined`);
    }
  }

  getFromMidiNote(midiNote) {
    return false;
  }
}
