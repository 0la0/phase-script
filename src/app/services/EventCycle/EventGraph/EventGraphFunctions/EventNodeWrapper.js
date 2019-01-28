import EventGraph from './EventGraph';

export default function eventNodeWrapper(transformer) {
  function higherOrderFunction(param) {
    if (param instanceof EventGraph) {
      return transformer(param);
    }
    if (typeof param === 'function') {
      return arg => {
        const result = param(arg);
        if (result instanceof EventGraph) {
          return transformer(result);
        }
        return higherOrderFunction(result);
      };
    }
    throw new TypeError(`Invalid type: ${param}`);
  }
  return higherOrderFunction;
}
