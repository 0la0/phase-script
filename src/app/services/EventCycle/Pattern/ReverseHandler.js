export function reverseHandler() {
  return function handleReverse(pattern) {
    return pattern.pushToTransformStack(({ relativeCycle, numTicks, cnt }) => {
      const transformedCycle = relativeCycle.map((cycleElement) => {
        const time = 1 - cycleElement.getTime();
        return cycleElement.setTime(time);
      }).reverse();
      return {
        relativeCycle: transformedCycle,
        numTicks,
        cnt
      };
    });
  };
}
