import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

export default class ReverseHandler extends BaseHandler {
  // constructor(patternString) {
  //   super();
  //   this.patternHandler = new PatternHandler(patternString);
  //   if (!this.patternHandler.pattern.ok) {
  //     return;
  //   }
  //   this.patternHandler.relativeCycle = this.patternHandler.relativeCycle.map((cycleElement) => {
  //     cycleElement.time = 1 - cycleElement.time;
  //     return cycleElement;
  //   }).reverse();
  // }

  constructor(handler) {
    super();
    // console.log('handler', handler);
    this.handler = handler;
    if (!this.handler.isValid()) {
      return;
    }

    const { cycle, updateCycle } = this.handler.getRelativeCycle();
    const transformedCycle = cycle.map((cycleElement) => {
      const time = 1 - cycleElement.getTime();
      return cycleElement.setTime(time);
    }).reverse();
    updateCycle(transformedCycle);
  }

  getRelativeCycle() {
    return this.handler.getRelativeCycle();
  }

  execute() {
    return this.handler.execute();
  }

  isValid() {
    return this.handler.isValid();
  }

  isDone() {
    return true;
  }
}
