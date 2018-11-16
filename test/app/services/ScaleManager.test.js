import assert from 'assert';
import ScaleManager from '../../../src/app/services/scale/ScaleManager';

describe('ScaleManager', () => {
  it('throws an error if a scale is not defined', () => {
    assert.throws(() => new ScaleManager('FOO'), Error, 'Scale FOO is not defined');
  });

  it('returns false for any input', () => {
    const scaleManager = new ScaleManager('major');
    assert.equal(scaleManager.getFromMidiNote(3), false);
  });
});
