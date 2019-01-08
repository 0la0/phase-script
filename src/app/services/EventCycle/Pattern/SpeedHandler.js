export function speedHandler(speed) {
  return function handleSpeed(pattern) {
    return pattern.pushToTransformStack(({ relativeCycle, cnt }) =>
      ({ relativeCycle, numTicks: speed, cnt }));
  };
}
