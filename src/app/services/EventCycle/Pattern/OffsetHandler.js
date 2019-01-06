import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
// import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

export function offsetHandler(offset) {
  return function handleOffset(pattern) {
    console.log('cool offset handler', offset, pattern)
    const { cycle, updateCycle } = pattern.getRelativeCycle();
    const transformedCycle = cycle.map((cycleElement) => {
      const transformedTime = cycleElement.time + offset;
      return cycleElement.setTime(transformedTime);
    });
    updateCycle(transformedCycle);
    return pattern;
  };
}

export default class OffsetHandler extends BaseHandler {
  constructor(offset, handler) {
    super();
    if (!handler.isValid()) {
      return;
    }
    this.handler = handler;

    const { cycle, updateCycle } = this.handler.getRelativeCycle();
    const transformedCycle = cycle.map((cycleElement) => {
      const transformedTime = cycleElement.time + offset;
      return cycleElement.setTime(transformedTime);
    });
    updateCycle(transformedCycle);

    // this.patternHandler.relativeCycle = this.patternHandler.relativeCycle.map((cycleElement) => {
    //   cycleElement.time = cycleElement.time + offset;
    //   return cycleElement;
    // });
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
