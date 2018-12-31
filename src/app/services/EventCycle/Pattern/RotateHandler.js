import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

export default class RotateHandler extends BaseHandler {
  constructor(rotation, handler) {
    super();
    this.handler = handler;
    if (!this.handler.isValid()) {
      return;
    }

    const { cycle, updateCycle } = this.handler.getRelativeCycle();
    const transformedCycle = cycle.map((cycleElement) => {
      const transformedTime = ((cycleElement.time - rotation) + 1) % 1;
      return cycleElement.setTime(transformedTime);
    });
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
