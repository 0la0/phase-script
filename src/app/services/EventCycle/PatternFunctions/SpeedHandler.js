import { PatternTransform } from 'services/EventCycle/PatternFunctions/PatternTransformer';

export default function speed(relativeSpeed) {
  if (Number.isNaN(relativeSpeed) || relativeSpeed <= 0) {
    throw new TypeError(`Illegal Argument: float > 0 required for speed(${speed})`);
  }
  const countPredicateFn = () => true;
  const transformFn = _pattern => {
    const numTicks = Math.round(_pattern.getNumTicks() * relativeSpeed);
    return _pattern.setNumTicks(numTicks);
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
