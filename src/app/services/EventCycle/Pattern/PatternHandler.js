import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import parseCycle from 'services/EventCycle/Parser';
import { getRelativeCycle } from 'services/EventCycle/Evaluator';

export default class PatternHandler extends BaseHandler {
  constructor(patternString) {
    super();
    this.pattern = parseCycle(patternString);
    this.relativeCycle = this.pattern.ok ?
      getRelativeCycle(this.pattern.content, 0, 1) : [];
  }

  getRelativeCycle() {
    return {
      cycle: this.relativeCycle,
      updateCycle: updatedCycle => this.relativeCycle = updatedCycle
    };
  }

  execute() {
    return this.relativeCycle;
  }

  isDone() {
    return true;
  }

  isValid() {
    return this.pattern.ok;
  }
}
