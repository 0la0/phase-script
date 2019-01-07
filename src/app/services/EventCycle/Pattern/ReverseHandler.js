export function reverseHandler() {
  return function handleReverse(pattern) {
    const { cycle, updateCycle } = pattern.getRelativeCycle();
    const transformedCycle = cycle.map((cycleElement) => {
      const time = 1 - cycleElement.getTime();
      return cycleElement.setTime(time);
    }).reverse();
    updateCycle(transformedCycle);
    return pattern;
  };
}
