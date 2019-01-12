import { getCycleForTime } from 'services/EventCycle/Evaluator';

export default class Pattern {
  constructor(relativeCycle, numTicks, cnt) {
    this.relativeCycle = relativeCycle;
    this.numTicks = numTicks;
    this.cnt = cnt;
  }

  setRelativeCycle(relativeCycle) {
    this.relativeCycle = relativeCycle;
    return this;
  }

  getRelativeCycle() {
    return this.relativeCycle;
  }

  setNumTicks(numTicks) {
    this.numTicks = numTicks;
    return this;
  }

  getNumTicks() {
    return this.numTicks;
  }

  getCnt() {
    return this.cnt;
  }

  getAudioEvents(time, audioCycleDuration) {
    return getCycleForTime(this.relativeCycle, time, audioCycleDuration);
  }
}
