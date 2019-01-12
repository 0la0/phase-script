import parseToken from 'services/EventCycle/Tokenizer';
import AudioEvent from 'services/EventBus/AudioEvent';

export function getCycleForTime(relativeCycle, baseTime, cycleDuration) {
  if (!Array.isArray(relativeCycle)) {
    throw new Error('Cycle must be an array');
  }
  return relativeCycle.map(cycleElement => {
    const preciseTime = baseTime.clone().add(cycleElement.getTime() * cycleDuration);
    const { address, note } = parseToken(cycleElement.getElement());
    return new AudioEvent(address, note, preciseTime);
  });
}
