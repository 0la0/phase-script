import AudioEvent from 'services/EventBus/AudioEvent';

function getNumericVal(noteString) {
  const floatNote = parseFloat(noteString, 10);
  return Number.isNaN(floatNote) ? undefined : floatNote;
}

export function parseToken(token, baseAddress) {
  if (typeof token !== 'string') {
    throw new Error('Tokenizer input must be a string', token);
  }
  const tokens = token.split(':');
  if (tokens.length === 1) {
    if (baseAddress && tokens[0] === 'x') {
      return new AudioEvent(baseAddress, undefined);
    }
    const note = getNumericVal(tokens[0]);
    if (note === undefined) {
      return undefined;
    }
    const address = baseAddress || tokens[0];
    return new AudioEvent(address, note);
  }
  if (tokens.length === 2) {
    const [ address, noteString ] = token.split(':');
    const note = getNumericVal(noteString);
    return new AudioEvent(address, note);
  }
}

export function buildAudioEventsFromPattern(relativeCycle, baseAddress, baseTime, cycleDuration) {
  if (!Array.isArray(relativeCycle)) {
    throw new Error('Cycle must be an array');
  }
  return relativeCycle.map(cycleElement => {
    const preciseTime = baseTime.clone().add(cycleElement.getTime() * cycleDuration);
    const audioEvent = parseToken(cycleElement.getElement(), baseAddress);
    return audioEvent ? audioEvent.setTime(preciseTime) : undefined;
  }).filter(Boolean);
}
