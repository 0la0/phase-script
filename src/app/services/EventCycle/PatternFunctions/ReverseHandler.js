import { PatternTransform } from 'services/EventCycle/PatternFunctions/PatternTransformer';

export default function reverse() {
  const countPredicateFn = () => true;
  const transformFn = _pattern => {
    const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
      const time = 1 - cycleElement.getTime();
      return cycleElement.setTime(time);
    }).reverse();
    return _pattern.setRelativeCycle(transformedCycle);
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
