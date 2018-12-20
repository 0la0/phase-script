import assert from 'assert';
import parseCycle from 'services/EventCycle/Parser';
import evaluateCycle, {
  RelativeCycleElement,
  getRelativeCycle,
} from 'services/EventCycle/Evaluator';
import TimeSchedule from 'services/metronome/TimeSchedule';

const DEFAULT = {
  TIME: new TimeSchedule(0, 0),
  DURATION: 4
};

function evaluateCycleWithDefaults(parsedCycle) {
  return evaluateCycle(DEFAULT.TIME, parsedCycle, DEFAULT.DURATION);
}

describe('CycleEvaluator', () => {
  it('throws an error if the cycle is not an array', () => {
    assert.throws(() => evaluateCycleWithDefaults('[]'), Error, 'Cycle must be an array');
  });

  it('returns an empty array', () => {
    const parsedCycle = parseCycle('[]').content;
    const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
    assert.deepEqual(evaluatedCycle, []);
  });

  it('returns a singleton', () => {
    const parsedCycle = parseCycle('[ a ]').content;
    const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
    assert.deepEqual(evaluatedCycle, [
      {
        time: { audio: 0, midi: 0},
        token: 'a'
      }
    ]);
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    assert.deepEqual(relativeCycle, [ new RelativeCycleElement('a', 0) ]);
  });

  it('evenly divides time between two elements', () => {
    const parsedCycle = parseCycle('[ a b ]').content;
    const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
    assert.deepEqual(evaluatedCycle, [
      {
        time: { audio: 0, midi: 0},
        token: 'a'
      },
      {
        time: { audio: 2, midi: 2000},
        token: 'b'
      }
    ]);
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement('a', 0),
      new RelativeCycleElement('b', 0.5)
    ]);
  });

  it('evenly divides time between three elements', () => {
    const parsedCycle = parseCycle('[ a b c ]').content;
    const evaluatedCycle = evaluateCycle(DEFAULT.TIME, parsedCycle, 3);
    assert.deepEqual(evaluatedCycle, [
      {
        time: { audio: 0, midi: 0},
        token: 'a'
      },
      {
        time: { audio: 1, midi: 1000},
        token: 'b'
      },
      {
        time: { audio: 2, midi: 2000},
        token: 'c'
      }
    ]);
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement('a', 0),
      new RelativeCycleElement('b', 0.333333),
      new RelativeCycleElement('c', 0.666667)
    ]);
  });

  it('evenly divides time between four elements', () => {
    const parsedCycle = parseCycle('[ a b c d ]').content;
    const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
    assert.deepEqual(evaluatedCycle, [
      {
        time: { audio: 0, midi: 0},
        token: 'a'
      },
      {
        time: { audio: 1, midi: 1000},
        token: 'b'
      },
      {
        time: { audio: 2, midi: 2000},
        token: 'c'
      },
      {
        time: { audio: 3, midi: 3000},
        token: 'd'
      }
    ]);
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement('a', 0),
      new RelativeCycleElement('b', 0.25),
      new RelativeCycleElement('c', 0.5),
      new RelativeCycleElement('d', 0.75)
    ]);
  });

  it('flattens nested cycles', () => {
    const parsedCycle = parseCycle('[ [ a ] [ b ] ]').content;
    const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
    assert.equal(evaluatedCycle.length, 2);
    assert.deepEqual(evaluatedCycle, [
      {
        time: { audio: 0, midi: 0},
        token: 'a'
      },
      {
        time: { audio: 2, midi: 2000},
        token: 'b'
      },
    ]);
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement('a', 0),
      new RelativeCycleElement('b', 0.5)
    ]);
  });

  it('evenly divides time in nested cycles', () => {
    const parsedCycle = parseCycle('[ [ a b c d ] [ 1 2 3 4 ] ]').content;
    const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
    assert.equal(evaluatedCycle.length, 8);
    assert.deepEqual(evaluatedCycle, [
      {
        time: { audio: 0, midi: 0},
        token: 'a'
      },
      {
        time: { audio: 0.5, midi: 500},
        token: 'b'
      },
      {
        time: { audio: 1, midi: 1000},
        token: 'c'
      },
      {
        time: { audio: 1.5, midi: 1500},
        token: 'd'
      },
      {
        time: { audio: 2, midi: 2000},
        token: '1'
      },
      {
        time: { audio: 2.5, midi: 2500},
        token: '2'
      },
      {
        time: { audio: 3, midi: 3000},
        token: '3'
      },
      {
        time: { audio: 3.5, midi: 3500},
        token: '4'
      },
    ]);
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
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
  });

  it('evenly divides time in nested cycles', () => {
    const parsedCycle = parseCycle('[ a [ b [ c d ] ] ]').content;
    const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
    assert.equal(evaluatedCycle.length, 4);
    assert.deepEqual(evaluatedCycle, [
      {
        time: { audio: 0, midi: 0},
        token: 'a'
      },
      {
        time: { audio: 2, midi: 2000},
        token: 'b'
      },
      {
        time: { audio: 3, midi: 3000},
        token: 'c'
      },
      {
        time: { audio: 3.5, midi: 3500},
        token: 'd'
      },
    ]);
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement('a', 0),
      new RelativeCycleElement('b', 0.5),
      new RelativeCycleElement('c', 0.75),
      new RelativeCycleElement('d', 0.875)
    ]);
  });
});
