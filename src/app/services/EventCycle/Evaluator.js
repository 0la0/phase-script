export class RelativeCycleElement {
  constructor(cycleElement, relativeTime) {
    this.cycleElement = cycleElement;
    this.relativeTime = relativeTime.toFixed(6);
  }

  getCycleElement() {
    return this.cycleElement;
  }

  getRelativeTime() {
    return this.relativeTime;
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

export default function evaluateCycle(time, cycle, cycleDuration) {
  if (!Array.isArray(cycle)) {
    throw new Error('Cycle must be an array');
  }
  const elementDuration = cycleDuration / cycle.length;
  return cycle.map((cycleElement, index) => {
    const timeObj = time.clone().add(index * elementDuration);
    if (Array.isArray(cycleElement)) {
      return evaluateCycle(timeObj, cycleElement, elementDuration);
    }
    return {
      token: cycleElement,
      time: timeObj
    };
  }).flat();
}
