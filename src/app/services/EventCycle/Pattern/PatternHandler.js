import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import parseCycle from 'services/EventCycle/Parser';
import { getRelativeCycle } from 'services/EventCycle/Evaluator';

// PUT ON BASE CLASS?
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

  // increment() {
  //   this.cnt++;
  // }

  reset() {
    this.cnt = 0;
  }
}

export default class PatternHandler extends BaseHandler {
  constructor(patternString) {
    super();
    console.log("pattern handler", patternString);
    this.pattern = parseCycle(patternString);
    this.counter = new Counter(16);
    this.length = 1;
    this.relativeCycle = this.pattern.ok ?
      getRelativeCycle(this.pattern.content, 0, 1) : [];
  }

  compile() {
    return this;
  }

  getRelativeCycle() {
    return {
      cycle: this.relativeCycle,
      updateCycle: updatedCycle => this.relativeCycle = updatedCycle,
      length: 1
    };
  }

  tick() {
    if (this.counter.tick()) {
      return {
        relativeCycle: this.relativeCycle,
        numTicks: this.counter.getNumTicks(),
      };
    }
  }

  getNumTicks() {
    return this.counter.getNumTicks();
  }

  execute() {
    return this.relativeCycle;
  }

  isDone() {
    return this.counter.isDone();
  }

  reset() {
    this.counter.reset();
  }

  setNumTicks(numTicks) {
    this.counter.setNumTicks(numTicks);
  }

  isValid() {
    return this.pattern.ok;
  }
}
