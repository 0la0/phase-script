import assert from 'assert';
import ParamTable from '../../../src/app/services/ParamTable';

describe('ParamTable', () => {
  it('returns false on an empty table', () => {
    const param = new ParamTable();
    assert.equal(param.getValueForTime(0), false);
  });

  it('returns nearest neighbor values', () => {
    const param = new ParamTable();
    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ]
      .forEach(val => param.addScheduledValue(val, `${val}`));
    assert.equal(param.table.length, 16);
    assert.equal(param.getValueForTime(0), 0);
    assert.equal(param.getValueForTime(3.3), 3);
    assert.equal(param.getValueForTime(6), 6);
    assert.equal(param.getValueForTime(7), 7);
    assert.equal(param.getValueForTime(1.2), 1);
    assert.equal(param.getValueForTime(1.5), 2);
    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ]
      .forEach(val => param.addScheduledValue(val, `${val}`));
    assert.equal(param.table.length, 16);
    assert.equal(param.getValueForTime(0), 0);
    assert.equal(param.getValueForTime(3.3), 3);
    assert.equal(param.getValueForTime(6), 6);
    assert.equal(param.getValueForTime(7), 7);
    assert.equal(param.getValueForTime(1.2), 1);
    assert.equal(param.getValueForTime(1.5), 2);
    [ 10, 11, 12, 13, 14, 15, 16, 17, 18, ]
      .forEach(val => param.addScheduledValue(val, `${val}`));
    assert.equal(param.getValueForTime(14.7), 15);
    assert.equal(param.getValueForTime(3.3), 3);
    param.addScheduledValue(19, `${19}`)
    assert.equal(param.getValueForTime(3.3), 4);
    [ 20, 21, 22, 23, ]
      .forEach(val => param.addScheduledValue(val, `${val}`));
    assert.equal(param.getValueForTime(0), 8);
    assert.equal(param.getValueForTime(25), 23);
    assert.equal(param.getValueForTime(16), 16);
    assert.equal(param.getValueForTime(22), 22);
    assert.equal(param.getValueForTime(23), 23);
    assert.equal(param.getValueForTime(27), 23);
  });
});
