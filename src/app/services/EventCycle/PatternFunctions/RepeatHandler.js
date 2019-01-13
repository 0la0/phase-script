import patternWrapper from 'services/EventCycle/PatternFunctions/PatternFunctionWrapper';

function repeatHandler(numRepeats) {
  return function handleRepeat(pattern) {
    const transform = {
      predicate: () => true,
      transform: (_pattern) => {
        const allTransformedCycles = [];
        for (let i = 0; i < numRepeats; i++) {
          const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
            const transformedTime = (i / numRepeats) + (cycleElement.getTime() / numRepeats);
            return cycleElement.clone().setTime(transformedTime);
          });
          allTransformedCycles.push(transformedCycle);
        }
        return _pattern
          .setRelativeCycle(allTransformedCycles.flat())
          .setNumTicks(numRepeats * _pattern.getNumTicks());
      },
    };
    return pattern.pushToTransformStack(transform);
  };
}

export default function repeat(num) {
  if (!Number.isInteger(num) || num < 1) {
    throw new TypeError(`Illegal Argument: integer required for repeat(${num})`);
  }
  return patternWrapper(repeatHandler(num));
}
