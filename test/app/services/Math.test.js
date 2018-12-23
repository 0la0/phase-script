import assert from 'assert';
import { floatingPrecision } from 'services/Math';

describe('Math.floatingPrecision', () => {
  it('only accepts numbers', () => {
    assert.throws(() => floatingPrecision('4', 4), Error, 'Input must be a number');
    assert.throws(() => floatingPrecision('0', 3), Error, 'Input must be a number');
    assert.throws(() => floatingPrecision('1', 2), Error, 'Input must be a number');
    assert.throws(() => floatingPrecision(undefined, 2), Error, 'Input must be a number');
    assert.throws(() => floatingPrecision(null, 2), Error, 'Input must be a number');
    assert.throws(() => floatingPrecision(true, 2), Error, 'Input must be a number');
    assert.throws(() => floatingPrecision(Number.prototype.constructor, 2), Error, 'Input must be a number');
  });

  it('returns floats with accurate precision', () => {
    assert.equal(floatingPrecision(0.12345, 0), 0);
    assert.equal(floatingPrecision(0.12345, 1), 0.1);
    assert.equal(floatingPrecision(0.12345, 2), 0.12);
    assert.equal(floatingPrecision(0.12345, 3), 0.123);
    assert.equal(floatingPrecision(0.12345, 4), 0.1235);
    assert.equal(floatingPrecision(0.12345, 5), 0.12345);
    assert.equal(floatingPrecision(1, 0), 1);
  });
});
