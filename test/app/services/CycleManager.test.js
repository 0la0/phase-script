import assert from 'assert';
import CycleManager from 'services/EventCycle/CycleManager';

describe('CycleManager', () => {
  it('only accepts strings', () => {
    assert.throws(() => new CycleManager.setCycleString(), Error, 'Input must be string');
    assert.throws(() => new CycleManager.setCycleString(null), Error, 'Input must be string');
    assert.throws(() => new CycleManager.setCycleString(true), Error, 'Input must be string');
    assert.throws(() => new CycleManager.setCycleString(true), Error, 'Input must be string');
    assert.throws(() => new CycleManager.setCycleString(false), Error, 'Input must be string');
    assert.throws(() => new CycleManager.setCycleString({}), Error, 'Input must be string');
    assert.throws(() => new CycleManager.setCycleString({ string: 'foo' }), Error, 'Input must be string');
    assert.throws(() => new CycleManager.setCycleString([ 'one', 'two' ]), Error, 'Input must be string');
    assert.throws(() => new CycleManager.setCycleString(String), Error, 'Input must be string');
    assert.throws(() => new CycleManager.setCycleString(String.prototype.constructor), Error, 'Input must be string');
    assert.throws(() => new CycleManager.setCycleString(0), Error, 'Input must be string');
    assert.throws(() => new CycleManager.setCycleString(1), Error, 'Input must be string');
  });
});
