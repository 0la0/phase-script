export function degradeHandler(threshold) {
  return function handleDegrade(pattern) {
    const transform = {
      predicate: () => true,
      transform: (_pattern) => {
        // const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
        //   const time = 1 - cycleElement.getTime();
        //   return cycleElement.setTime(time);
        // }).reverse();
        const transformedCycle = _pattern.getRelativeCycle()
          .filter(() => Math.random() < threshold);
        return _pattern.setRelativeCycle(transformedCycle);
      },
    };
    return pattern.pushToTransformStack(transform);
  };
}
