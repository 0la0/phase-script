import { PatternTransform } from 'services/EventCycle/PatternFunctions/PatternTransformer';

export default function degrade(threshold) {
  if (Number.isNaN(threshold) || threshold < 0 || threshold > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for degrade(${threshold})`);
  }
  const countPredicateFn = () => true;
  const transformFn = _pattern => {
    const transformedCycle = _pattern.getRelativeCycle()
      .filter(() => Math.random() < threshold);
    return _pattern.setRelativeCycle(transformedCycle);
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
