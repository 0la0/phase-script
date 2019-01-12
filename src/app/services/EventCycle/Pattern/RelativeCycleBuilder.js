import { floatingPrecision } from 'services/Math';

export class RelativeCycleElement {
  constructor(element, relativeTime) {
    this.element = element;
    this.time = floatingPrecision(relativeTime, 6);
  }

  getElement() {
    return this.element;
  }

  getTime() {
    return this.time;
  }

  setTime(time) {
    this.time = time;
    return this;
  }

  clone() {
    return new RelativeCycleElement(this.element, this.time);
  }
}

// THIS NEEDS TO BE: relativeCycleBuilder ...
export function getRelativeCycle(cycle, baseTime = 0, cycleDuration = 1) {
  if (!Array.isArray(cycle)) {
    throw new Error('Cycle must be an array');
  }
  const elementDuration = cycleDuration / cycle.length;
  return cycle
    .map((cycleElement, index) => {
      const localBaseTime = baseTime + index * elementDuration;
      if (Array.isArray(cycleElement)) {
        return getRelativeCycle(cycleElement, localBaseTime, elementDuration);
      }
      return new RelativeCycleElement(cycleElement, localBaseTime);
    })
    .flat();
}
