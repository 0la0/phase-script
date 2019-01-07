export function speedHandler(speed) {
  return function handleSpeed(pattern) {
    pattern.setNumTicks(speed);
    return pattern.pushToTransformStack(() => {
      pattern.setNumTicks(speed);
    });
  };
}
