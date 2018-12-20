import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
// import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';
import parseCycle from 'services/EventCycle/Parser';

export default class ReverseHandler extends BaseHandler {
  constructor(patternString) {
    super();
    this.pattern = parseCycle(patternString);
    console.log('ReverseHandler', this.pattern);
  }

  execute() {
    return this.pattern;
  }

  isValid() {
    return this.pattern.ok;
  }

  isDone() {
    return true;
  }
}
