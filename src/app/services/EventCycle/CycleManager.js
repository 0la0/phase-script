import CycleHandler from 'services/EventCycle/CycleHandler';
import { evaluateUserInput } from 'services/EventCycle/Evaluator';
import { createEventGraph } from 'services/EventCycle/EventGraphHandler';

export default class CycleManager {
  constructor() {
    this.cycleHandlers = [];
    this.setCycleString('');
  }

  setCycleString(cycleString) {
    if (typeof cycleString !== 'string') {
      throw new Error('Input must be string');
    }
    if (!cycleString) {
      return;
    }
    let cycleResults;
    let eventGraph;
    try {
      const { sequences, addressInlets } = evaluateUserInput(cycleString);
      cycleResults = sequences;
      eventGraph = createEventGraph(addressInlets);
      console.log('eventGraph', eventGraph);
    } catch(error) {
      // TODO: render error message
      console.log('result error', error);
      this._isValid = false;
      return;
    }
    this._isValid = cycleResults.every(cycleResult => cycleResult.every(cycle => cycle.isValid()));
    if (this._isValid) {
      this.cycleHandlers = cycleResults.map(cycleResult => new CycleHandler(cycleResult));
    }
  }

  isValid() {
    return this._isValid;
  }

  getAudioEventsAndIncrement(time, tickLength) {
    return this.cycleHandlers
      .map(cycleHandler => cycleHandler.handleTick(time, tickLength))
      .filter(schedulables => !!schedulables)
      .flat();
  }
}
