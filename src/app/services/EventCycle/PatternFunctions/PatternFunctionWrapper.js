import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

export default function patternWrapper(transformer) {
  function higherOrderFunction(param) {
    if (param instanceof PatternHandler) {
      return transformer(param);
    }
    if (typeof param === 'function') {
      return arg => {
        const result = param(arg);
        if (result instanceof PatternHandler) {
          return transformer(result);
        }
        return higherOrderFunction(result);
      };
    }
    throw new TypeError(`Invalid type: ${param}`);
  }
  return higherOrderFunction;
}
