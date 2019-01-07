import parseCycle from 'services/EventCycle/Parser';
import { getRelativeCycle } from 'services/EventCycle/Evaluator';

class Counter {
  constructor(numTicks) {
    this.numTicks = numTicks;
    this.cnt = 0;
  }

  tick() {
    return this.cnt++ === 0;
  }

  isDone() {
    return this.cnt >= this.numTicks;
  }

  getNumTicks() {
    return this.numTicks;
  }

  setNumTicks(numTicks) {
    this.numTicks = numTicks;
  }

  reset() {
    this.cnt = 0;
  }
}

class EveryHandler {
  constructor(iteration, pattern) {
    this.iteration = iteration;
    this.pattern = pattern;
  }

  requestPattern(cnt) {
    if (cnt % this.iteration !== 0) {
      return false;
    }
    return this.pattern.relativeCycle;
  }
}

class CycleHandler {
  constructor(patternString) {
    this.pattern = parseCycle(patternString);
    this.relativeCycle = this.pattern.ok ?
      getRelativeCycle(this.pattern.content, 0, 1) : [];
  }

  getRelativeCycle() {
    return this.relativeCycle;
  }

  setRelativeCycle(relativeCycle) {
    this.relativeCycle = relativeCycle;
  }

  isValid() {
    return this.pattern.ok;
  }
}

export default class PatternHandler {
  constructor(patternString, numTicks) {
    this.cycleHandlers = [ new CycleHandler(patternString), ];
    this.counter = new Counter(numTicks || 16);
    this.cnt = 0;
    this.transforms = [];
  }

  // TODO: instead of callback, create an update method like below
  getRelativeCycle() {
    return {
      cycle: this.cycleHandlers[0].getRelativeCycle(),
      updateCycle: updatedCycle => this.cycleHandlers[0].setRelativeCycle(updatedCycle),
    };
  }

  // update(transformer) {
  //   this.relativeCycle = transformer(this.relativeCycle);
  //   return this;
  // }

  tick() {
    // if (this.counter.tick()) {
    //   const everyModified = this.everyHandler && this.everyHandler.requestPattern(this.cnt);
    //   return {
    //     relativeCycle: everyModified ? everyModified : this.relativeCycle,
    //     numTicks: this.counter.getNumTicks(),
    //   };
    // }
    if (this.counter.tick()) {
      console.log('do real time transforms', this.transforms);
      const cycle = this.cycleHandlers[0];
      return {
        relativeCycle: cycle.getRelativeCycle(),
        numTicks: this.counter.getNumTicks(),
      };
    }
  }

  pushToTransformStack(transform) {
    this.transforms.push(transform);
    return this;
  }

  getNumTicks() {
    return this.counter.getNumTicks();
  }

  isDone() {
    return this.counter.isDone();
  }

  reset() {
    this.counter.reset();
    this.cnt++;
  }

  addEveryHandler(iteration, pattern) {
    this.everyHandler = new EveryHandler(iteration, pattern);
  }

  setNumTicks(numTicks) {
    this.counter.setNumTicks(numTicks);
  }

  isValid() {
    return this.cycleHandlers.every(handler => handler.isValid());
  }
}
