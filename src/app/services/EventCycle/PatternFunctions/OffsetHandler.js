import { PatternTransform } from 'services/EventCycle/PatternFunctions/PatternTransformer';

export default function offset(offset) {
  if (Number.isNaN(offset) || offset < 0 || offset > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for offset(${offset})`);
  }
  const countPredicateFn = () => true;
  const transformFn = _pattern => {
    const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
      const transformedTime = cycleElement.getTime() + offset;
      return cycleElement.setTime(transformedTime);
    });
    return _pattern.setRelativeCycle(transformedCycle);
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
