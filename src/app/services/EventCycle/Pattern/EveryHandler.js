
export function everyHandler(iteration, transform) {
  return function handleEvery(pattern) {

    // TODO: clone pattern and transform
    // const transformedCycle = transform(pattern);
    // pattern.addEveryHandler(iteration, transformedCycle);
    // return pattern;

    return pattern.pushToTransformStack((arg) => {
      if (arg.cnt % iteration !== 0) {
        return arg;
      }
      const syntheticResult = transform({ pushToTransformStack: transform });
      return syntheticResult(arg);
    });
  };
}
