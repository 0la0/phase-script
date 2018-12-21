import assert from 'assert';
import parseCycle from 'services/EventCycle/Parser';
import {
  RelativeCycleElement,
  PreciseCycleElement,
  getRelativeCycle,
  getCycleForTime,
} from 'services/EventCycle/Evaluator';
import TimeSchedule from 'services/metronome/TimeSchedule';

describe('CycleEvaluator', () => {
  it('throws an error if the cycle is not an array', () => {
    assert.throws(() => getRelativeCycle('[]'), Error, 'Cycle must be an array');
    assert.throws(() => getCycleForTime('[]'), Error, 'Cycle must be an array');
  });

  it('returns an empty array', () => {
    const parsedCycle = parseCycle('[]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = getCycleForTime(relativeCycle, { audio: 0, midi: 0 }, 4);
    assert.deepEqual(relativeCycle, []);
    assert.deepEqual(cycleForTime, []);
  });

  it('returns a singleton', () => {
    const parsedCycle = parseCycle('[ a ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = getCycleForTime(relativeCycle, new TimeSchedule(2, 2000), 4);
    assert.deepEqual(relativeCycle, [ new RelativeCycleElement('a', 0) ]);
    assert.deepEqual(cycleForTime, [ new PreciseCycleElement('a', new TimeSchedule(2, 2000)) ]);
  });

  it('evenly divides time between two elements', () => {
    const parsedCycle = parseCycle('[ a b ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = getCycleForTime(relativeCycle, new TimeSchedule(2, 2000), 4);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement('a', 0),
      new RelativeCycleElement('b', 0.5)
    ]);
    assert.deepEqual(cycleForTime, [
      new PreciseCycleElement('a', new TimeSchedule(2, 2000)),
      new PreciseCycleElement('b', new TimeSchedule(4, 4000)),
    ]);
  });

  it('evenly divides time between three elements', () => {
    const parsedCycle = parseCycle('[ a b c ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = getCycleForTime(relativeCycle, new TimeSchedule(3, 3000), 3);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement('a', 0),
      new RelativeCycleElement('b', 0.333333),
      new RelativeCycleElement('c', 0.666667)
    ]);
    assert.deepEqual(cycleForTime, [
      new PreciseCycleElement('a', new TimeSchedule(3, 3000)),
      new PreciseCycleElement('b', new TimeSchedule(3.999999, 3999.999)),
      new PreciseCycleElement('c', new TimeSchedule(5.000001, 5000.001))
    ]);
  });

  it('evenly divides time between four elements', () => {
    const parsedCycle = parseCycle('[ a b c d ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = getCycleForTime(relativeCycle, new TimeSchedule(4, 4000), 2);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement('a', 0),
      new RelativeCycleElement('b', 0.25),
      new RelativeCycleElement('c', 0.5),
      new RelativeCycleElement('d', 0.75)
    ]);
    assert.deepEqual(cycleForTime, [
      new PreciseCycleElement('a', new TimeSchedule(4, 4000)),
      new PreciseCycleElement('b', new TimeSchedule(4.5, 4500)),
      new PreciseCycleElement('c', new TimeSchedule(5, 5000)),
      new PreciseCycleElement('d', new TimeSchedule(5.5, 5500))
    ]);
  });

  it('flattens nested cycles', () => {
    const parsedCycle = parseCycle('[ [ a ] [ b ] ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = getCycleForTime(relativeCycle, new TimeSchedule(2, 2000), 1);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement('a', 0),
      new RelativeCycleElement('b', 0.5)
    ]);
    assert.deepEqual(cycleForTime, [
      new PreciseCycleElement('a', new TimeSchedule(2, 2000)),
      new PreciseCycleElement('b', new TimeSchedule(2.5, 2500))
    ]);
  });

  it('evenly divides time in nested cycles', () => {
    const parsedCycle = parseCycle('[ [ a b c d ] [ 1 2 3 4 ] ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = getCycleForTime(relativeCycle, new TimeSchedule(), 8);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement('a', 0),
      new RelativeCycleElement('b', 0.125),
      new RelativeCycleElement('c', 0.25),
      new RelativeCycleElement('d', 0.375),
      new RelativeCycleElement('1', 0.5),
      new RelativeCycleElement('2', 0.625),
      new RelativeCycleElement('3', 0.75),
      new RelativeCycleElement('4', 0.875)
    ]);
    assert.deepEqual(cycleForTime, [
      new PreciseCycleElement('a', new TimeSchedule(0, 0)),
      new PreciseCycleElement('b', new TimeSchedule(1, 1000)),
      new PreciseCycleElement('c', new TimeSchedule(2, 2000)),
      new PreciseCycleElement('d', new TimeSchedule(3, 3000)),
      new PreciseCycleElement('1', new TimeSchedule(4, 4000)),
      new PreciseCycleElement('2', new TimeSchedule(5, 5000)),
      new PreciseCycleElement('3', new TimeSchedule(6, 6000)),
      new PreciseCycleElement('4', new TimeSchedule(7, 7000))
    ]);
  });

  it('evenly divides time in nested cycles', () => {
    const parsedCycle = parseCycle('[ a [ b [ c d ] ] ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = getCycleForTime(relativeCycle, new TimeSchedule(0, 0), 8);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement('a', 0),
      new RelativeCycleElement('b', 0.5),
      new RelativeCycleElement('c', 0.75),
      new RelativeCycleElement('d', 0.875)
    ]);
    assert.deepEqual(cycleForTime, [
      new PreciseCycleElement('a', new TimeSchedule(0, 0)),
      new PreciseCycleElement('b', new TimeSchedule(4, 4000)),
      new PreciseCycleElement('c', new TimeSchedule(6, 6000)),
      new PreciseCycleElement('d', new TimeSchedule(7, 7000)),
    ]);
  });
});
