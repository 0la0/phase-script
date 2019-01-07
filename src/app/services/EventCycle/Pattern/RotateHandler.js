export function rotateHandler(rotation) {
  return function handleRotate(pattern) {
    const { cycle, updateCycle } = pattern.getRelativeCycle();
    const transformedCycle = cycle.map((cycleElement) => {
      const transformedTime = ((cycleElement.time - rotation) + 1) % 1;
      return cycleElement.setTime(transformedTime);
    });
    updateCycle(transformedCycle);
    return pattern;
  };
}
