import PatternTransformer from './PatternTransformer';
import p from './PatternBuilder';
const speed = (...args) => new PatternTransformer().speed(...args);
const rotate = (...args) => new PatternTransformer().rotate(...args);
const reverse = (...args) => new PatternTransformer().reverse(...args);
const repeat = (...args) => new PatternTransformer().repeat(...args);
const offset = (...args) => new PatternTransformer().offset(...args);
const degrade = (...args) => new PatternTransformer().degrade(...args);
const every = (...args) => new PatternTransformer().every(...args);

export const patternApi = [ p, degrade, repeat, reverse, offset, rotate, speed, every ];
