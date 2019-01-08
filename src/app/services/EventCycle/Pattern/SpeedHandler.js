
export function speedHandler(speed) {
  return function handleSpeed(pattern) {
    const transform = {
      predicate: () => true,
      transform: _p => _p.setNumTicks(speed),
    };
    return pattern.pushToTransformStack(transform);
  };
}
