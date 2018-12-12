import cycleParser from 'services/EventCycle/Parser';
import evaluateCycle from 'services/EventCycle/Evaluator';
import parseToken from 'services/EventCycle/Tokenizer';
import AudioEvent from 'services/EventBus/AudioEvent';

export default class CycleManager {
  constructor() {
    this.parsedCycles = [];
    this.cycleCounter = 0;
    this.setCycleString('');
  }

  setCycleString(cycleString) {
    this.nextCycleString = cycleString;
    const parsedCycles = cycleParser(cycleString);
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
