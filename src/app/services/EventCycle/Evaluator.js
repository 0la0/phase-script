export class RelativeCycleElement {
  constructor(element, relativeTime) {
    this.element = element;
    this.time = relativeTime.toFixed(6);
  }

  getElement() {
    return this.element;
  }

  getTime() {
    return this.time;
  }
}

export class PreciseCycleElement {
  constructor(element, timeObj) {
    this.element = element;
    this.timeObj = timeObj;
  }

  getElement() {
    return this.element;
  }

  getTimeObj() {
    return this.timeObj;
  }
}

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

export function getCycleForTime(cycle, baseTime, cycleDuration) {
  if (!Array.isArray(cycle)) {
    throw new Error('Cycle must be an array');
  }
  return cycle.map(cycleElement => {
    const preciseTime = baseTime.clone().add(cycleElement.getTime() * cycleDuration);
    return new PreciseCycleElement(cycleElement.getElement(), preciseTime);
  });
}
