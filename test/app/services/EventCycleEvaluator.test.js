import assert from 'assert';
import cycleParser from 'services/EventCycle/Parser';
import evaluateCycle from 'services/EventCycle/Evaluator';
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
    const parsedCycle = cycleParser('[]').content;
    const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
    assert.deepEqual(evaluatedCycle, []);
  });

  it('returns a singleton', () => {
    const parsedCycle = cycleParser('[ a ]').content;
    const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
    assert.deepEqual(evaluatedCycle, [
      {
        time: { audio: 0, midi: 0},
        token: 'a'
      }
    ]);
  });

  it('evenly divides time between two elements', () => {
    const parsedCycle = cycleParser('[ a b ]').content;
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
  });

  it('evenly divides time between three elements', () => {
    const parsedCycle = cycleParser('[ a b c ]').content;
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
  });

  it('evenly divides time between four elements', () => {
    const parsedCycle = cycleParser('[ a b c d ]').content;
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
  });

  it('flattens nested cycles', () => {
    const parsedCycle = cycleParser('[ [ a ] [ b ] ]').content;
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
  });

  it('evenly divides time in nested cycles', () => {
    const parsedCycle = cycleParser('[ [ a b c d ] [ 1 2 3 4 ] ]').content;
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
  });

  it('...evenly divides time in nested cycles', () => {
    const parsedCycle = cycleParser('[ a [ b [ c d ] ] ]').content;
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
  });
});