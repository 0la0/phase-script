import { getCycleForTime } from 'services/EventCycle/Evaluator';
import parseToken from 'services/EventCycle/Tokenizer';
import AudioEvent from 'services/EventBus/AudioEvent';
import { evaluate } from 'services/EventCycle/Evaluator2';

class Counter {
  constructor(length) {
    this.length = length;
    this.cnt = 0;
  }

  setLength(length) {
    this.length = length;
  }

  isReady() {
    return this.cnt === 0;
  }

  increment() {
    return this.cnt++;
  }

  isDone() {
    return this.cnt >= this.length;
  }

  reset() {
    this.cnt = 0;
  }
}

class CycleHandler {
  constructor(patternHandlers) {
    this.patternHandlers = patternHandlers;
    this.cycleCounter = 0;
    this.cycleIndex = 0;
    this.counter = new Counter(0);
  }

  handleTick(time, tickLength) {
    const activeCycle = this.patternHandlers[this.cycleIndex];
    if (!activeCycle) { return; }
    let audioEvents;
    if (this.counter.isReady()) {
      const pattern = activeCycle.tick();
      const numTicks = pattern.getNumTicks();
      const audioCycleDuration = tickLength * numTicks;
      this.counter.setLength(numTicks);
      audioEvents = pattern.getAudioEvents(time, audioCycleDuration);
      // schedulables = getCycleForTime(pattern.getRelativeCycle(), time, audioCycleDuration);
    }

    this.counter.increment();
    if (this.counter.isDone()) {
      this.cycleIndex = (this.cycleIndex + 1) % this.patternHandlers.length;
      this.counter.reset();
    }
    return audioEvents;
  }
}

export default class CycleManager {
  constructor() {
    this.cycleHandlers = [];
    this.cycleCounter = 0;
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
      const result = evaluate(cycleString);
      cycleResults = result;
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
    return this.cycleHandlers.map(cycleHandler => cycleHandler.handleTick(time, tickLength))
      .filter(schedulables => !!schedulables)
      .flat();
      // .map(({ element, timeObj}) => {
      //   // TODO: make handleTick return an array of AudioEvents
      //   const { address, note } = parseToken(element);
      //   return new AudioEvent(address, note, timeObj);
      // });
  }
}
