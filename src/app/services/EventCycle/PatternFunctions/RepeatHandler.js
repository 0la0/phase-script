import { PatternTransform } from 'services/EventCycle/PatternFunctions/PatternTransformer';

export default function repeat(numRepeats) {
  if (!Number.isInteger(numRepeats) || numRepeats < 1) {
    throw new TypeError(`Illegal Argument: integer required for repeat(${numRepeats})`);
  }
  const countPredicateFn = () => true;
  const transformFn = _pattern => {
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
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
