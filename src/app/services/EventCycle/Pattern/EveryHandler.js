
export function everyHandler(iteration, transform) {
  return function handleEvery(pattern) {

    // console.log('handleEvery', iteration, transform);

    // TODO: clone pattern and transform
    const transformedCycle = transform(pattern);
    pattern.addEveryHandler(iteration, transformedCycle);
    return pattern;
  };
}
