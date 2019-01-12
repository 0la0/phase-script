
export function everyHandler(iteration, transform) {
  return function handleEvery(pattern) {
    const res = transform(pattern.clone());
    const predicate = (cnt) => cnt % iteration === 0;
    res.transforms.forEach(transform => {
      pattern.pushToTransformStack({
        predicate,
        transform: transform.transform
      });
    });
    return pattern;
  };
}
