export function rotateHandler(rotation) {
  return function handleRotate(pattern) {
    return pattern.pushToTransformStack(({ relativeCycle, numTicks, cnt }) => {
      const transformedCycle = relativeCycle.map((cycleElement) => {
        const transformedTime = ((cycleElement.time - rotation) + 1) % 1;
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
