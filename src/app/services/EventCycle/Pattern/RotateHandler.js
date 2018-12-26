import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

export default class RotateHandler extends BaseHandler {
  constructor(rotation, patternString) {
    super();
    this.patternHandler = new PatternHandler(patternString);
    if (!this.patternHandler.pattern.ok) {
      return;
    }
    this.patternHandler.relativeCycle = this.patternHandler.relativeCycle.map((cycleElement) => {
      cycleElement.time = ((cycleElement.time - rotation) + 1) % 1;
      return cycleElement;
    });
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
