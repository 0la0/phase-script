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

export class Pattern {
  constructor(relativeCycle, numTicks, cnt) {
    this.relativeCycle = relativeCycle;
    this.numTicks = numTicks;
    this.cnt = cnt;
  }

  setRelativeCycle(relativeCycle) {
    this.relativeCycle = relativeCycle;
    return this;
  }

  getRelativeCycle() {
    return this.relativeCycle;
  }

  setNumTicks(numTicks) {
    this.numTicks = numTicks;
    return this;
  }

  getNumTicks() {
    return this.numTicks;
  }

  getCnt() {
    return this.cnt;
  }
}

export default class PatternHandler {
  constructor(patternString, numTicks) {
    this.cycleHandlers = [ new CycleHandler(patternString), ];
    this.counter = new Counter(numTicks || 16);
    this.cnt = 0;
    this.transforms = [];
  }

  getRelativeCycle() {
    return {
      cycle: this.cycleHandlers[0].getRelativeCycle(),
      updateCycle: updatedCycle => this.cycleHandlers[0].setRelativeCycle(updatedCycle),
    };
  }

  tick() {
    const cnt = this.cnt++;
    const relativeCycle = this.getActiveCycle().map(ele => ele.clone());
    const pattern = new Pattern(relativeCycle, this.counter.getNumTicks(), cnt);

    return this.transforms.reduce((pattern, xform) => {
      const { transform, predicate } = xform;
      if (!predicate(cnt)) {
        return pattern;
      }
      return transform(pattern);
    }, pattern);
  }

  getActiveCycle() {
    return this.cycleHandlers[0].getRelativeCycle();
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

  clone() {
    const instance = new PatternHandler('');
    instance.cycleHandlers = this.cycleHandlers;
    return instance;
  }
}
