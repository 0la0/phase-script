import patternWrapper from 'services/EventCycle/PatternFunctions/PatternFunctionWrapper';

function everyHandler(iteration, transform) {
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

export default function everyFn(iteration, transform) {
  return patternWrapper(everyHandler(iteration, transform));
}
