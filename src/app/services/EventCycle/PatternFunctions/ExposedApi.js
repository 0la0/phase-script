import PatternTransformer from './PatternTransformer';
import pattern from './PatternBuilder';

function buildPatternFunction(name) {
  if (name === 'p') {
    const scopedFuncitonName = 'p';
    return { [scopedFuncitonName]: function(...args) {
      return pattern(...args);
    } }[scopedFuncitonName];
  }
  const scopedFuncitonName = `${name}`;
  return { [scopedFuncitonName]: function(...args) {
    return new PatternTransformer()[name](...args);
  } }[scopedFuncitonName];
}

export const patternApi = [
  'p',
  'speed',
  'rotate',
  'reverse',
  'repeat',
  'offset',
  'degrade',
  'every',
  'arp'
].map(name => ({ name, fn: buildPatternFunction(name) }));
