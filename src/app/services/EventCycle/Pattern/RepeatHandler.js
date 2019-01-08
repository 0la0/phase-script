export function repeatHandler(numRepeats) {
  return function handleRepeat(pattern) {
    const transform = {
      predicate: () => true,
      transform: (_pattern) => {
        const allTransformedCycles = [];
        for (let i = 0; i < numRepeats; i++) {
          const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
            const transformedTime = (i / numRepeats) + (cycleElement.time / numRepeats);
            return cycleElement.clone().setTime(transformedTime);
          });
          allTransformedCycles.push(transformedCycle);
        }
        return _pattern.setRelativeCycle(allTransformedCycles.flat())
          .setNumTicks(numRepeats * pattern.getNumTicks());
      },
    };
    return pattern.pushToTransformStack(transform);
  };
}
