import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import parseCycle from 'services/EventCycle/Parser';

export default class PatternHandler extends BaseHandler {
  constructor(patternString) {
    super();
    this.pattern = parseCycle(patternString);
  }

  execute() {
    return this.pattern;
  }

  isDone() {
    return true;
  }

  isValid() {
    return this.pattern.ok;
  }
}
