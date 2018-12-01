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
