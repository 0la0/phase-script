import scales from './scales';

function getProgressiveScale(scale) {
  let sum = 0;
  return scale.map((note) => {
    sum += note;
    return sum;
  });
}

export default class ScaleManager {
  constructor(scale) {
    if (!scales[scale]) {
      throw new Error(`Scale ${scale} is not defined`);
    }
    this.scale = [0].concat(scales[scale]);
    this.progressiveScale = getProgressiveScale(this.scale);
  }

  getNearestNote(baseNote, midiNote) {
    if (midiNote === baseNote) { return midiNote; }
    if (midiNote <= 0) { return 0; }
    if (midiNote >= 127) { return 127; }

    const difference = midiNote - baseNote;
    const octave = Math.floor(difference / 12);
    const scaleBase = 12 * octave + baseNote;
    const test = this.progressiveScale.map(scaleNote => {
      const note = scaleBase + scaleNote;
      return { note, distance: Math.abs(midiNote - note) };
    }).sort((a, b) => a.distance - b.distance);
    return test[0].note;
  }
}
