import CycleHandler from 'services/EventCycle/CycleHandler';
import { evaluateUserInput } from 'services/EventCycle/Evaluator';
import { createEventGraph } from 'services/EventCycle/EventGraphHandler';
import { buildEventGraph } from 'services/EventCycle/EventGraph/EventGraphBuilder';

export default class CycleManager {
  constructor() {
    this.cycleHandlers = [];
    this.nextCycleHandlers = null;
    this.nextGraphDefinition = null;
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
    try {
      const { sequences, audioGraphInlets } = evaluateUserInput(cycleString);
      cycleResults = sequences;
      const allInlets = audioGraphInlets.map(inlet => inlet.getEventGraph());
      this.nextGraphDefinition = createEventGraph(allInlets);
      console.log('nextGraphDefinition', this.nextGraphDefinition)
    } catch(error) {
      // TODO: render error message
      console.log('result error', error);
      this._isValid = false;
      return;
    }
    this._isValid = cycleResults.every(cycleResult => cycleResult.every(cycle => cycle.isValid()));
    if (this._isValid) {
      this.nextCycleHandlers = cycleResults.map(cycleResult => new CycleHandler(cycleResult));
    }
  }

  isValid() {
    return this._isValid;
  }

  getAudioEventsAndIncrement(time, tickLength, shouldRefresh) {
    if (this.nextCycleHandlers && shouldRefresh) {
      this.cycleHandlers = this.nextCycleHandlers;
      this.nextCycleHandlers = null;
      if (this.nextGraphDefinition) {
        buildEventGraph(this.nextGraphDefinition, time);
        this.nextGraphDefinition = null;
      }
    }
    return this.cycleHandlers
      .map(cycleHandler => cycleHandler.handleTick(time, tickLength))
      .filter(schedulables => !!schedulables)
      .flat();
  }
}
