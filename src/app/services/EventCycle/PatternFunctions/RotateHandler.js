import { PatternTransform } from 'services/EventCycle/PatternFunctions/PatternTransformer';

export default function rotate(rotation) {
  if (Number.isNaN(rotation) || rotation < 0 || rotation > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for rotate(${rotation})`);
  }
  const countPredicateFn = () => true;
  const transformFn = _pattern => {
    const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
      const transformedTime = ((cycleElement.getTime() - rotation) + 1) % 1;
      return cycleElement.setTime(transformedTime);
    });
    return _pattern.setRelativeCycle(transformedCycle);
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
