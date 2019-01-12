import parseCycle from 'services/EventCycle/Pattern/PatternStringParser';
import { getRelativeCycle } from 'services/EventCycle/Pattern/RelativeCycleBuilder';
import Pattern from 'services/EventCycle/Pattern/Pattern';

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
