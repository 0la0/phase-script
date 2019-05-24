import AudioEvent from 'services/EventBus/AudioEvent';

function getNumericValue(str) {
  const floatNote = parseFloat(str, 10);
  return Number.isNaN(floatNote) ? undefined : floatNote;
}

function parseNoteValue(str) {
  let interpolate = false;
  let note = undefined;
  if (str.charAt(0) === '_') {
    interpolate = true;
    note = getNumericValue(str.substring(1));
  } else {
    note = getNumericValue(str);
  }
  return { note, interpolate };
}

export function parseToken(token, baseAddress) {
  if (typeof token !== 'string') {
    throw new Error('Tokenizer input must be a string', token);
  }
  const tokens = token.split(':');
  if (tokens.length === 1) {
    const token = tokens[0];
    if (baseAddress && token === 'x') {
      // interpolate base address ?
      return new AudioEvent(baseAddress, undefined, undefined, false);
    }
    const { note, interpolate} = parseNoteValue(token);
    if (note === undefined) {
      // interpolate token?
      return new AudioEvent(token, undefined, undefined, interpolate);
    }
    const address = baseAddress || token;
    return new AudioEvent(address, note, undefined, interpolate);
  }
  if (tokens.length === 2) {
    // interpolate address or token?
    const [ address, noteString ] = token.split(':');
    const { note, interpolate} = parseNoteValue(noteString);
    return new AudioEvent(address, note, undefined, interpolate);
  }
}

export function buildAudioEventsFromPattern(relativeCycle, baseAddress, baseTime, cycleDuration) {
  if (!Array.isArray(relativeCycle)) {
    throw new Error('Cycle must be an array');
  }
  return relativeCycle.map(cycleElement => {
    const preciseTime = baseTime.clone().add(cycleElement.getTime() * cycleDuration);
    const audioEvent = cycleElement.getElement();
    return audioEvent ? audioEvent.setTime(preciseTime) : undefined;
  }).filter(Boolean);
}
