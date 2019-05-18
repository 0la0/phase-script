import assert from 'assert';
import { parseToken } from 'services/EventCycle/Pattern/AudioEventBuilder';
import AudioEvent from 'services/EventBus/AudioEvent';

describe('Tokenizer', () => {
  it('throws an error if the cycle is not a string', () => {
    assert.throws(() => parseToken(true), Error, 'Tokenizer input must be a string');
    assert.throws(() => parseToken(false), Error, 'Tokenizer input must be a string');
    assert.throws(() => parseToken(1), Error, 'Tokenizer input must be a string');
    assert.throws(() => parseToken([]), Error, 'Tokenizer input must be a string');
    assert.throws(() => parseToken({}), Error, 'Tokenizer input must be a string');
    assert.throws(() => parseToken(null), Error, 'Tokenizer input must be a string');
    assert.throws(() => parseToken(undefined), Error, 'Tokenizer input must be a string');
  });

  it('returns an address note pair', () => {
    assert.deepEqual(parseToken('a:1'), new AudioEvent('a', 1, undefined, false));
    assert.deepEqual(parseToken('b:127'), new AudioEvent('b', 127, undefined, false));
  });

  it('uses the base address', () => {
    assert.deepEqual(parseToken('5', 'b'), new AudioEvent('b', 5, undefined, false));
    assert.deepEqual(parseToken('a', 'b'), new AudioEvent('a', 60, undefined, false));
    assert.deepEqual(parseToken('hello'), new AudioEvent('hello', 60, undefined, false));
  });

  it('handles "x" as a trigger character only when given a base address', () => {
    assert.deepEqual(parseToken('x', 'some-address'), new AudioEvent('some-address', 60, undefined, false));
    assert.deepEqual(parseToken('x'), new AudioEvent('x', 60, undefined, false));
  });

  it('parses underscores as interpolation flags', () => {
    assert.deepEqual(parseToken('a:_5'), new AudioEvent('a', 5, undefined, true));
    assert.deepEqual(parseToken('a:_'), new AudioEvent('a', 60, undefined, true));
    assert.deepEqual(parseToken('_a'), new AudioEvent('_a', 60, undefined, true));
    assert.deepEqual(parseToken('_72', 'b'), new AudioEvent('b', 72, undefined, true));
    assert.deepEqual(parseToken('_'), new AudioEvent('_', 60, undefined, true));
  });
});
