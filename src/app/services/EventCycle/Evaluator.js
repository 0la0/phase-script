export class CycleElement {
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
      return new CycleElement(cycleElement, localBaseTime);
    })
    .flat();
}

export function getCycleForTime(cycle, baseTime, cycleDuration) {
  if (!Array.isArray(cycle)) {
    throw new Error('Cycle must be an array');
  }
  return cycle.map(cycleElement => {
    const preciseTime = baseTime + cycleElement.getTime() * cycleDuration;
    return new CycleElement(cycleElement.getElement(), preciseTime);
  });
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
