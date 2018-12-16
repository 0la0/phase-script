import assert from 'assert';
import CycleManager from 'services/EventCycle/CycleManager';
import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';

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

  it('handles line breaks', () => {
    const cycleManager = new CycleManager();
    cycleManager.setCycleString('[]\n[]');
    assert.deepEqual(cycleManager.patternHandlers, [
      new PatternHandler('[]'),
      new PatternHandler('[]'),
    ]);
    cycleManager.setCycleString('a b [ c d ]\n1 2 [3 4 5]');
    assert.deepEqual(cycleManager.patternHandlers, [
      new PatternHandler('a b [ c d ]'),
      new PatternHandler('1 2 [3 4 5]'),
    ]);
  });
});
