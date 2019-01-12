export function rotateHandler(rotation) {
  return function handleRotate(pattern) {
    const transform = {
      predicate: () => true,
      transform: (_pattern) => {
        const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
          const transformedTime = ((cycleElement.getTime() - rotation) + 1) % 1;
          return cycleElement.setTime(transformedTime);
        });
        return _pattern.setRelativeCycle(transformedCycle);
      },
    };
    return pattern.pushToTransformStack(transform);
  };
}
