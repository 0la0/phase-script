import patternWrapper from 'services/EventCycle/PatternFunctions/PatternFunctionWrapper';

function speedHandler(speed) {
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

export default function speed(speed) {
  if (Number.isNaN(speed) || speed <= 0) {
    throw new TypeError(`Illegal Argument: float > 0 required for speed(${speed})`);
  }
  return patternWrapper(speedHandler(speed));
}
