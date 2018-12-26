import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

export default class BreakHandler extends BaseHandler {
  constructor(patternString) {
    super();
    this.patternHandler = new PatternHandler(patternString);
    this.breakHandler = new PatternHandler(patternString);
    if (!this.patternHandler.pattern.ok) {
      return;
    }
    this.count = 1;
    const brokenCycle1 = this.breakHandler.relativeCycle
      .map((cycleElement) => {
        const time = (((cycleElement.getTime() / 2) - 0.125) + 0.5) % 0.5;
        return cycleElement.clone().setTime(time);
      })
      .sort((a, b) => a.time - b.time);
    const brokenCycle2 = brokenCycle1.map(ele => ele.clone().setTime(ele.getTime() + 0.5));
    this.breakHandler.relativeCycle = brokenCycle1.concat(brokenCycle2);
  }

  execute() {
    if (this.count++ % 2 === 0) {
      return this.breakHandler.execute();
    }
    return this.patternHandler.execute();
  }

  isValid() {
    return this.patternHandler.isValid();
  }

  isDone() {
    return true;
  }

  reset() {}
}
