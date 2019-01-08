export function reverseHandler() {
  return function handleReverse(pattern) {
    const transform = {
      predicate: () => true,
      transform: (_pattern) => {
        const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
          const time = 1 - cycleElement.getTime();
          return cycleElement.setTime(time);
        }).reverse();
        return _pattern.setRelativeCycle(transformedCycle);
      },
    };
    return pattern.pushToTransformStack(transform);
  };
}
