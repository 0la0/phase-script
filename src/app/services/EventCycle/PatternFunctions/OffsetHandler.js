import patternWrapper from 'services/EventCycle/PatternFunctions/PatternFunctionWrapper';

function offsetHandler(offset) {
  return function handleOffset(pattern) {
    const transform = {
      predicate: () => true,
      transform: (_pattern) => {
        const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
          const transformedTime = cycleElement.getTime() + offset;
          return cycleElement.setTime(transformedTime);
        });
        return _pattern.setRelativeCycle(transformedCycle);
      },
    };
    return pattern.pushToTransformStack(transform);
  };
}

export default function offset(offset) {
  if (Number.isNaN(offset) || offset < 0 || offset > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for offset(${offset})`);
  }
  return patternWrapper(offsetHandler(offset));
}
