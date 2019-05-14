import assert from 'assert';
import { parseToken } from 'services/EventCycle/Pattern/AudioEventBuilder';

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
    assert.deepEqual(parseToken('a:1'), { address: 'a', note: 1, time: 0 });
    assert.deepEqual(parseToken('b:127'), { address: 'b', note: 127, time: 0 });
    assert.deepEqual(parseToken('hello'), { address: 'hello', note: 60, time: 0 });
  });
});
