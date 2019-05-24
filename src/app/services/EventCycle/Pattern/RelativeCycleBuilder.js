import { parseToken } from './AudioEventBuilder';
import RelativeCycleElement from './RelativeCycleElement';

export default function getRelativeCycle(cycle, baseTime = 0, cycleDuration = 1, baseAddress = '') {
  if (!Array.isArray(cycle)) {
    throw new Error('Cycle must be an array');
  }
  const elementDuration = cycleDuration / cycle.length;
  return cycle
    .map((cycleElement, index) => {
      const localBaseTime = baseTime + index * elementDuration;
      if (Array.isArray(cycleElement)) {
        return getRelativeCycle(cycleElement, localBaseTime, elementDuration, baseAddress);
      }
      const audioEvent = parseToken(cycleElement, baseAddress);
      return new RelativeCycleElement(audioEvent, localBaseTime);
    })
    .flat();
}
