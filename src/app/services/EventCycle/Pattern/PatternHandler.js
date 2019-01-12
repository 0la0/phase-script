import parseCycle from 'services/EventCycle/Parser';
import { getRelativeCycle } from 'services/EventCycle/Evaluator';

export class Pattern {
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
}

export default class PatternHandler {
  constructor(patternString, numTicks) {
    this.patternString = patternString;
    this.pattern = parseCycle(patternString);
    this.relativeCycle = this.pattern.ok ? getRelativeCycle(this.pattern.content, 0, 1) : [];
    this.numTicks = numTicks || 16;
    this.cnt = 0;
    this.transforms = [];
  }

  tick() {
    const cnt = this.cnt++;
    const clonedCycle = this.relativeCycle.map(ele => ele.clone());
    const pattern = new Pattern(clonedCycle, this.numTicks, cnt);

    return this.transforms.reduce((pattern, xform) => {
      const { transform, predicate } = xform;
      if (!predicate(cnt)) {
        return pattern;
      }
      return transform(pattern);
    }, pattern);
  }

  pushToTransformStack(transform) {
    this.transforms.push(transform);
    return this;
  }

  isValid() {
    return this.pattern.ok;
  }

  clone() {
    return new PatternHandler(this.patternString);
  }
}
