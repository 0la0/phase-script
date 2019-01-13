import patternWrapper from 'services/EventCycle/PatternFunctions/PatternFunctionWrapper';

function degradeHandler(threshold) {
  return function handleDegrade(pattern) {
    const transform = {
      predicate: () => true,
      transform: (_pattern) => {
        const transformedCycle = _pattern.getRelativeCycle()
          .filter(() => Math.random() < threshold);
        return _pattern.setRelativeCycle(transformedCycle);
      },
    };
    return pattern.pushToTransformStack(transform);
  };
}

export default function degradeFn(threshold) {
  if (Number.isNaN(threshold) || threshold < 0 || threshold > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for degrade(${threshold})`);
  }
  return patternWrapper(degradeHandler(threshold));
}
