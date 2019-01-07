export function repeatHandler(numRepeats) {
  return function handleRepeat(pattern) {
    const { cycle, updateCycle } = pattern.getRelativeCycle();
    const allTransformedCycles = [];
    for (let i = 0; i < numRepeats; i++) {
      const transformedCycle = cycle.map((cycleElement) => {
        const transformedTime = (i / numRepeats) + (cycleElement.time / numRepeats);
        return cycleElement.clone().setTime(transformedTime);
      });
      allTransformedCycles.push(transformedCycle);
    }
    updateCycle(allTransformedCycles.flatMap(cycle => cycle));
    pattern.setNumTicks(numRepeats * pattern.getNumTicks());
    return pattern;
  };
}
