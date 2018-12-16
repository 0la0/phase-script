import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

export default class RepeatHandler extends BaseHandler {
  constructor(numRepeats, patternString) {
    super();
    this.patternHandler = new PatternHandler(patternString);
    this.numRepeats = numRepeats;
  }

  execute() {
    this.count++;
    return this.patternHandler.execute();
  }

  isValid() {
    return this.patternHandler.isValid();
  }

  isDone() {
    return this.count >= this.numRepeats;
  }
}
