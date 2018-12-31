import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
// import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

export default class OffsetHandler extends BaseHandler {
  constructor(offset, handler) {
    super();
    if (!handler.isValid()) {
      return;
    }
    this.handler = handler;

    const { cycle, updateCycle } = this.handler.getRelativeCycle();
    const transformedCycle = cycle.map((cycleElement) => {
      const transformedTime = cycleElement.time + offset;
      return cycleElement.setTime(transformedTime);
    });
    updateCycle(transformedCycle);

    // this.patternHandler.relativeCycle = this.patternHandler.relativeCycle.map((cycleElement) => {
    //   cycleElement.time = cycleElement.time + offset;
    //   return cycleElement;
    // });
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
