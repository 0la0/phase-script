
function getNormalizedScale(scale) {
  let runningTotal = 0;
  const sum = scale.reduce((memo, item) => memo + item, 0);
  const probabilityDensityBuckets = scale.map(value => {
    const proportion = value / sum;
    const lowerBound = runningTotal + proportion;
    runningTotal = lowerBound;
    return lowerBound;
  });
  probabilityDensityBuckets.unshift(0);
  return probabilityDensityBuckets;
}

function getProgressiveScale(scale) {
  let runningTotal = 0;
  const clone = scale.map(value => value);
  clone.unshift(0);

  return clone.map(value => {
    runningTotal += value;
    return runningTotal;
  });
}

function getIndexFromNormalizedScale(normalizedScale, value) {
  const normalValue = Math.abs(value) % 1;
  let matchingIndex = 0;
  for (let i = 0; i < normalizedScale.length - 1; i++) {
    const lowerBound = normalizedScale[i];
    const upperBound = normalizedScale[i + 1];
    if (normalValue >= lowerBound && normalValue <= upperBound) {
      matchingIndex = i;
      break;
    }
  }
  return matchingIndex;
}

//in progressive scale, the last value should be the same as the next rollover
function getNoteValue(progressiveScale, index, octave, direction, baseNote) {
  const lastNote = progressiveScale[progressiveScale.length - 1];
  const octaveMultiplier = lastNote * octave;
  const note = baseNote + direction * (progressiveScale[index] + octaveMultiplier);
  return note;
}

export default class ScaleHelper {

  constructor(inputScale) {
    this.normalizedScale = getNormalizedScale(inputScale);
    this.progressiveScale = getProgressiveScale(inputScale);
  }

  getNoteFromNormalizedValue(normalValue, baseNote) {
    const matchingIndex = getIndexFromNormalizedScale(this.normalizedScale, normalValue);
    const octave = Math.floor(Math.abs(normalValue));
    const direction = normalValue >= 0 ? 1 : -1;
    return getNoteValue(this.progressiveScale, matchingIndex, octave, direction, baseNote);
  }

}
