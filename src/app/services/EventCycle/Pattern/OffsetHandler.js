export function offsetHandler(offset) {
  return function handleOffset(pattern) {
    const transform = {
      predicate: () => true,
      transform: (_pattern) => {
        const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
          const transformedTime = cycleElement.time + offset;
          return cycleElement.setTime(transformedTime);
        });
        return _pattern.setRelativeCycle(transformedCycle);
      },
    };
    return pattern.pushToTransformStack(transform);
  };
}
