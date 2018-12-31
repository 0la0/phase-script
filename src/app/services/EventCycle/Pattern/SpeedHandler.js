import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
// import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

function isPowerOf2(num) {
  if (num < 1) {
    return false;
  }
  if (num % 1 !== 0) {
    return false;
  }
  return (num & (num  - 1)) === 0;
}

export default class SpeedHandler extends BaseHandler {
  constructor(speed, handler) {
    super();
    if (speed !== 2) {
      throw new Error(`${speed} !== 2`);
    }
    this.handler = handler;
    if (!this.handler.isValid()) {
      return;
    }

    const { cycle, updateCycle } = this.handler.getRelativeCycle();
    const transformedCycle = cycle.map((cycleElement) => {
      const transformedTime = cycleElement.getTime() * 2;
      return cycleElement.setTime(transformedTime);
    });
    updateCycle(transformedCycle);
  }

  getRelativeCycle() {
    return this.handler.getRelativeCycle();
  }

  execute() {
    this.count++;
    if (this.count % 2 === 0) {
      return [];
    }
    return this.handler.execute();
  }

  isValid() {
    return this.handler.isValid();
  }

  isDone() {
    return this.count % 2 === 0;
  }
}
