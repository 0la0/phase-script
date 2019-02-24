const freqA4 = 440;
const midiA4 = 69;

export function mtof(midiNote) {
  return freqA4 * Math.pow(2, (midiNote - midiA4) / 12);
}

export function ftom(frequency) {
  return midiA4 + Math.round(12 * Math.log2(frequency / freqA4));
}

export const AUDIO_TICK_MULTIPLIER = 1000;
