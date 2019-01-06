import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

export function reverseHandler() {
  return function handleReverse(pattern) {
    console.log('real cool reverseHandler', pattern);
    const { cycle, updateCycle } = pattern.getRelativeCycle();
    const transformedCycle = cycle.map((cycleElement) => {
      const time = 1 - cycleElement.getTime();
      return cycleElement.setTime(time);
    }).reverse();
    updateCycle(transformedCycle);
    return pattern;
  };
}

// export function reverseHandler(pattern) {
//   console.log('cool reverseHandler', pattern);
//   const { cycle, updateCycle } = pattern.getRelativeCycle();
//   const transformedCycle = cycle.map((cycleElement) => {
//     const time = 1 - cycleElement.getTime();
//     return cycleElement.setTime(time);
//   }).reverse();
//   updateCycle(transformedCycle);
//   return pattern;
// }

export default class ReverseHandler extends BaseHandler {
  constructor(handler) {
    super();
    this.handler = typeof handler === 'function' ? handler() : handler;
    // this.handler = handler;
    console.log('ReverseHandler', handler)
    if (!this.handler.isValid()) {
      return;
    }
    const { cycle, updateCycle } = this.handler.getRelativeCycle();
    const transformedCycle = cycle.map((cycleElement) => {
      const time = 1 - cycleElement.getTime();
      return cycleElement.setTime(time);
    }).reverse();
    updateCycle(transformedCycle);
  }

  getRelativeCycle() {
    return this.handler.getRelativeCycle();
  }

  execute() {
    return this.handler.execute();
  }

  tick() {
    return this.handler.tick();
  }

  getNumTicks() {
    return this.handler.getNumTicks();
  }

  setNumTicks(numTicks) {
    this.handler.setNumTicks(numTicks);
  }

  isValid() {
    return this.handler.isValid();
  }

  isDone() {
    return this.handler.isDone();
  }

  reset() {
    return this.handler.reset();
  }
}
