export function offsetHandler(offset) {
  return function handleOffset(pattern) {
    // const { cycle, updateCycle } = pattern.getRelativeCycle();
    // const transformedCycle = cycle.map((cycleElement) => {
    //   const transformedTime = cycleElement.time + offset;
    //   return cycleElement.setTime(transformedTime);
    // });
    // updateCycle(transformedCycle);
    // return pattern;

    return pattern.pushToTransformStack(({ relativeCycle, numTicks, cnt }) => {
      const transformedCycle = relativeCycle.map((cycleElement) => {
        const transformedTime = cycleElement.time + offset;
        return cycleElement.setTime(transformedTime);
      });
      return {
        relativeCycle: transformedCycle,
        numTicks,
        cnt
      };
    });
  };
}
