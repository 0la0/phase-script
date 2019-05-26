import arpeggiate from './ArpeggiatorHandler';
import degrade from './DegradeHandler';
import offset from './OffsetHandler';
import repeat from './RepeatHandler';
import reverse from './ReverseHandler';
import rotate from './RotateHandler';
import speed from './SpeedHandler';

export class PatternTransform {
  constructor(countPredicate, transform) {
    this.countPredicate = countPredicate;
    this.transform = transform;
  }

  getCountPredicate() {
    return this.countPredicate;
  }

  getTransform() {
    return this.transform;
  }
}

export default class PatternTransformer {
  constructor() {
    this.transforms = [];
  }

  arp(arpStyle, step, distance, rate, repeat) {
    this.transforms.push(arpeggiate(arpStyle, step, distance, rate, repeat));
    return this;
  }

  degrade(threshold) {
    this.transforms.push(degrade(threshold));
    return this;
  }

  every(iteration, patternTransformer) {
    if (!Number.isInteger(iteration) || iteration < 2) {
      throw new TypeError(`Illegal Argument: integer greater than 1 required for every(${iteration}, patternTransform)`);
    }
    if (!(patternTransformer instanceof PatternTransformer)) {
      throw new TypeError(`Illegal Argument: PatternTransformer required for every(${iteration}, patternTransform)`);
    }
    const predicate = (cnt) => cnt % iteration === 0;
    patternTransformer.transforms.forEach(transform =>
      this.transforms.push(new PatternTransform(predicate, transform.transform)));
    return this;
  }

  offset(relativeOffset) {
    this.transforms.push(offset(relativeOffset));
    return this;
  }

  repeat(numRepeats) {
    this.transforms.push(repeat(numRepeats));
    return this;
  }

  reverse() {
    this.transforms.push(reverse());
    return this;
  }

  rotate(rotation) {
    this.transforms.push(rotate(rotation));
    return this;
  }

  speed(relativeSpeed) {
    this.transforms.push(speed(relativeSpeed));
    return this;
  }
}
