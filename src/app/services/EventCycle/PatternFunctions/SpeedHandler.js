
export function speedHandler(speed) {
  return function handleSpeed(pattern) {
    const transform = {
      predicate: () => true,
      transform: (_pattern) => {
        const numTicks = Math.round(_pattern.getNumTicks() * speed);
        return _pattern.setNumTicks(numTicks);
      },
    };
    return pattern.pushToTransformStack(transform);
  };
}
