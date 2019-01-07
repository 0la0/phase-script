import { getCycleForTime } from 'services/EventCycle/Evaluator';
import parseToken from 'services/EventCycle/Tokenizer';
import { audioEventBus } from 'services/EventBus';
import AudioEvent from 'services/EventBus/AudioEvent';
import { evaluate } from 'services/EventCycle/Evaluator2';
import metronomeManager from 'services/metronome/metronomeManager';

class CycleHandler {
  constructor(patternHandlers) {
    this.patternHandlers = patternHandlers;
    this.cycleCounter = 0;
    this.cycleIndex = 0;
  }

  handleTick(time) {
    const activeCycle = this.patternHandlers[this.cycleIndex];
    if (!activeCycle) { return; }
    // TODO: need to do on the fly function evaluation
    const pattern = activeCycle.tick();
    if (pattern) {
      const { relativeCycle, numTicks } = pattern;
      const audioCycleDuration = metronomeManager.getMetronome().getTickLength() * numTicks;
      // TODO: return schedulabes so this can be testable
      const schedulables = getCycleForTime(relativeCycle, time, audioCycleDuration);
      schedulables.forEach(({ element, timeObj}) => {
        const { address, note } = parseToken(element);
        audioEventBus.publish(new AudioEvent(address, note, timeObj));
      });
    }
    if (activeCycle.isDone()) {
      activeCycle.reset();
      this.cycleIndex = (this.cycleIndex + 1) % this.patternHandlers.length;
    }
  }
}

export default class CycleManager {
  constructor() {
    this.cycleHandlers = [];
    this.cycleCounter = 0;
    this.setCycleString('');
  }

  setCycleString(cycleString) {
    console.log('setCycleString', cycleString)
    if (typeof cycleString !== 'string') {
      throw new Error('Input must be string');
    }
    if (!cycleString) {
      return;
    }

    let cycleResults;
    try {
      const result = evaluate(cycleString);
      console.log('result:', result);
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

  getAudioEventsAndIncrement(time) {
    this.cycleHandlers.forEach(cycleHandler => cycleHandler.handleTick(time))

    // return this.cycleHandlers
    //   .map(cycleHandler => cycleHandler.increment(audioCycleDuration, time))
    //   .flatMap();
  }
}
