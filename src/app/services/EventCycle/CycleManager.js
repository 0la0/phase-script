import evaluateCycle from 'services/EventCycle/Evaluator';
import parseToken from 'services/EventCycle/Tokenizer';
import AudioEvent from 'services/EventBus/AudioEvent';
import functionManager from 'services/EventCycle/Pattern/FunctionManager';

const LINE_BREAK = /\n/;

export default class CycleManager {
  constructor() {
    this.patternHandlers = [];
    this.cycleCounter = 0;
    this.setCycleString('');
  }

  setCycleString(cycleString) {
    if (typeof cycleString !== 'string') {
      throw new Error('Input must be string');
    }
    const patternHandlers = cycleString.split(LINE_BREAK)
      .map(line => line.trim())
      .filter(line => !!line)
      .map(line => functionManager.classify(line));

    this._isValid = patternHandlers.every(cycle => cycle.isValid());
    if (this._isValid) {
      this.patternHandlers = patternHandlers;
    }
  }

  isValid() {
    return this._isValid;
  }

  getAudioEventsAndIncrement(audioCycleDuration, time) {
    const cycleIndex = this.cycleCounter % this.patternHandlers.length;
    if (this.patternHandlers[cycleIndex]) {
      const pattern = this.patternHandlers[cycleIndex].execute();
      if (this.patternHandlers[cycleIndex].isDone()) {
        this.patternHandlers[cycleIndex].reset();
        this.cycleCounter++;
      }
      const schedulables = evaluateCycle(time, pattern.content, audioCycleDuration);
      return schedulables.map(({ token, time}) => {
        const { address, note } = parseToken(token);
        return new AudioEvent(address, note, time);
      });
    }
    this.cycleCounter++;
  }

  resetCounter() {
    this.cycleCounter = 0;
  }
}
