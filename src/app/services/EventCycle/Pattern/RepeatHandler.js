export function repeatHandler(numRepeats) {
  return function handleRepeat(pattern) {
    const transform = {
      predicate: () => true,
      transform: (_pattern) => {
        const allTransformedCycles = [];
        for (let i = 0; i < numRepeats; i++) {
          const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
            const transformedTime = (i / numRepeats) + (cycleElement.getTime() / numRepeats);
            return cycleElement.clone().setTime(transformedTime);
          });
          allTransformedCycles.push(transformedCycle);
        }
        return _pattern
          .setRelativeCycle(allTransformedCycles.flat())
          .setNumTicks(numRepeats * _pattern.getNumTicks());
      },
    };
    return pattern.pushToTransformStack(transform);
  };
}
