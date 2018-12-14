import functionManager, { PatternHandler } from './FunctionManager';

import parseCycle from 'services/EventCycle/Parser';
import evaluateCycle from 'services/EventCycle/Evaluator';
import parseToken from 'services/EventCycle/Tokenizer';
import AudioEvent from 'services/EventBus/AudioEvent';

const LINE_BREAK = /\n/;
const WHITESPACE = /(\s+)/;

export default class CycleManager {
  constructor() {
    this.parsedCycles = [];
    this.cycleCounter = 0;
    this.setCycleString('');
  }

  setCycleString(cycleString) {
    if (typeof cycleString !== 'string') {
      throw new Error('Input must be string');
    }

    // cycleString.split(LINE_BREAK)
    //   .map(line => line.trim())
    //   .filter(line => !!line)
    //   .forEach(line => {
    //     const tokens = line.split(WHITESPACE);
    //     if (functionManager.isFunction(tokens[0])) {
    //       functionManager.validate(tokens, line);
    //     }
    //   });

    this.nextCycleString = cycleString;
    const parsedCycles = cycleString.split(LINE_BREAK)
      .map(line => line.trim())
      .filter(line => !!line)
      .map(line => parseCycle(line));


    // const parsedCycles = cycleParser(cycleString);
    this._isValid = parsedCycles.every(cycle => cycle.ok);
    if (this._isValid) {
      this.parsedCycles = parsedCycles;
    }
  }

  isValid() {
    return this._isValid;
  }

  getAudioEventsAndIncrement(audioCycleDuration, time) {
    const cycleIndex = this.cycleCounter % this.parsedCycles.length;
    if (this.parsedCycles[cycleIndex]) {
      this.cycleCounter++;
      const schedulables = evaluateCycle(time, this.parsedCycles[cycleIndex].content, audioCycleDuration);
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
