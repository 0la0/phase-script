import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

export default class ReverseHandler extends BaseHandler {
  constructor(patternString) {
    super();
    this.patternHandler = new PatternHandler(patternString);
    if (!this.patternHandler.pattern.ok) {
      return;
    }
    this.patternHandler.relativeCycle = this.patternHandler.relativeCycle.map((cycleElement) => {
      cycleElement.time = 1 - cycleElement.time;
      return cycleElement;
    }).reverse();
  }

  execute() {
    return this.patternHandler.execute();
  }

  isValid() {
    return this.patternHandler.isValid();
  }

  isDone() {
    return true;
  }
}
