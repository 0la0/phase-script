export function repeatHandler(numRepeats) {
  return function handleRepeat(pattern) {
    return pattern.pushToTransformStack(({ relativeCycle, cnt }) => {
      const allTransformedCycles = [];
      for (let i = 0; i < numRepeats; i++) {
        const transformedCycle = relativeCycle.map((cycleElement) => {
          const transformedTime = (i / numRepeats) + (cycleElement.time / numRepeats);
          return cycleElement.clone().setTime(transformedTime);
        });
        allTransformedCycles.push(transformedCycle);
      }
      return {
        relativeCycle: allTransformedCycles,
        numTicks: numRepeats * pattern.getNumTicks(),
        cnt
      };
    });
  };
}
