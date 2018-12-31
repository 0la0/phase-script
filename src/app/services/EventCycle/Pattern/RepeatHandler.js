import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';

export default class RepeatHandler extends BaseHandler {
  constructor(numRepeats, handler) {
    super();
    this.handler = handler;
    this.numRepeats = numRepeats;
  }

  getRelativeCycle() {
    return this.handler.getRelativeCycle();
  }

  execute() {
    this.count++;
    return this.handler.execute();
  }

  isValid() {
    return this.handler.isValid();
  }

  isDone() {
    return this.count >= this.numRepeats;
  }
}
