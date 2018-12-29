import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

function isPowerOf2(num) {
  if (num < 1) {
    return false;
  }
  if (num % 1 !== 0) {
    return false;
  }
  return (num & (num  - 1)) === 0;
}

export default class SpeedHandler extends BaseHandler {
  constructor(speed, patternString) {
    super();
    this.patternHandler = new PatternHandler(patternString);
    if (speed !== 2) {
      throw new Error(`${speed} !== 2`);
    }
    if (!this.patternHandler.pattern.ok) {
      return;
    }
    this.patternHandler.relativeCycle
      .forEach((cycleElement) => {
        const transformedTime = cycleElement.getTime() * 2;
        cycleElement.setTime(transformedTime);
      });
  }

  execute() {
    this.count++;
    if (this.count % 2 === 0) {
      return [];
    }
    return this.patternHandler.execute();
  }

  isValid() {
    return this.patternHandler.isValid();
  }

  isDone() {
    return this.count % 2 === 0;
  }
}
