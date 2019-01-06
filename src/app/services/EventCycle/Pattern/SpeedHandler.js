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

export function speedHandler(speed) {
  return function handleSpeed(pattern) {
    console.log('cool speed handler', speed, pattern)
    pattern.setNumTicks(speed);
    return pattern;
  };
}

// export function speedHandler(speed, pattern) {
//   console.log('speed handler', speed, pattern)
//   pattern.setNumTicks(speed);
//   return pattern;
// }

// TODO: for now, change to LenghtHandler, ie length(20) (pattern("a a [a a]"))
export default class SpeedHandler extends BaseHandler {
  constructor(speed, handler) {
    super();

    if (!Number.isInteger(speed)) {
      throw new Error('Speed requires an integer');
    }
    if (speed < 1 || speed > 16) {
      throw new Error('Speed requires an integer [0, 16]');
    }
    // if (speed !== 2) {
    //   throw new Error(`${speed} !== 2`);
    // }
    console.log('speed handler', speed, handler)
    this.handler = typeof handler === 'function' ? handler() : handler;
    if (!this.handler.isValid()) {
      return;
    }
    this.setNumTicks(speed);

    // const { cycle, updateCycle } = this.handler.getRelativeCycle();
    // const transformedCycle = cycle.map((cycleElement) => {
    //   const transformedTime = cycleElement.getTime() * 2;
    //   return cycleElement.setTime(transformedTime);
    // });
    // updateCycle(transformedCycle);
  }

  compile() {

  }

  getRelativeCycle() {
    return this.handler.getRelativeCycle();
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
    return this.handler.isDone();
  }

  reset() {
    return this.handler.reset();
  }
}
