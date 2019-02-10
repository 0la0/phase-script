import parseCycle from 'services/EventCycle/Pattern/PatternStringParser';
import { getRelativeCycle } from 'services/EventCycle/Pattern/RelativeCycleBuilder';
import Pattern from 'services/EventCycle/Pattern/Pattern';
import PatternTransformer from './PatternTransformer';

class PatternBuilder extends PatternTransformer{
  constructor(patternString, numTicks) {
    super();
    this.patternString = patternString;
    this.pattern = parseCycle(patternString);
    this.relativeCycle = this.pattern.ok ? getRelativeCycle(this.pattern.content, 0, 1) : [];
    this.numTicks = numTicks || 16;
    this.cnt = 0;
  }

  tick() {
    const cnt = this.cnt++;
    const clonedCycle = this.relativeCycle.map(ele => ele.clone());
    const originalPattern = new Pattern(clonedCycle, this.numTicks, cnt);

    return this.transforms.reduce((pattern, patternTransform) => {
      if (!patternTransform.countPredicate(cnt)) {
        return pattern;
      }
      return patternTransform.transform(pattern);
    }, originalPattern);
  }

  isValid() {
    return this.pattern.ok;
  }

  clone() {
    return new PatternBuilder(this.patternString);
  }
}

export default function p(str) {
  if (typeof str !== 'string') {
    throw new TypeError(`Illegal Argument: string required for p(${str})`);
  }
  return new PatternBuilder(str);
}
