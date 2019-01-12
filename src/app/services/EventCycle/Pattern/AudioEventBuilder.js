import AudioEvent from 'services/EventBus/AudioEvent';

export function parseToken(token) {
  if (typeof token !== 'string') {
    throw new Error('Tokenizer input must be a string', token);
  }
  const [ address, noteString ] = token.split(':');
  const intNote = parseInt(noteString, 10);
  const note = isNaN(intNote) ? undefined : intNote;
  return { address, note };
}

export function buildAudioEventsFromPattern(relativeCycle, baseTime, cycleDuration) {
  if (!Array.isArray(relativeCycle)) {
    throw new Error('Cycle must be an array');
  }
  return relativeCycle.map(cycleElement => {
    const preciseTime = baseTime.clone().add(cycleElement.getTime() * cycleDuration);
    const { address, note } = parseToken(cycleElement.getElement());
    return new AudioEvent(address, note, preciseTime);
  });
}
