import assert from 'assert';
import cycleParser from '../../../src/app/services/EventCycle/Parser';
import evaluateCycle from '../../../src/app/services/EventCycle/Evaluator';

const DEFAULT = {
  TIME: { audio: 0, midi: 0 },
  TICK_LENGTH: 1,
  DURATION: 4
};

function evaluateCycleWithDefaults(parsedCycle) {
  return evaluateCycle(DEFAULT.TIME, DEFAULT.TICK_LENGTH, parsedCycle, DEFAULT.DURATION);
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
        tickLength: 1,
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
        tickLength: 1,
        time: { audio: 0, midi: 0},
        token: 'a'
      },
      {
        tickLength: 1,
        time: { audio: 3, midi: 3000},
        token: 'b'
      }
    ]);
  });

  // it('evenly divides time between three elements', () => {
  //   const parsedCycle = cycleParser('[ a b c ]').content;
  //   const evaluatedCycle = evaluateCycle(DEFAULT.TIME, DEFAULT.TICK_LENGTH, parsedCycle, 3);
  //   assert.deepEqual(evaluatedCycle, [
  //     {
  //       tickLength: 1,
  //       time: { audio: 0, midi: 0},
  //       token: 'a'
  //     },
  //     {
  //       tickLength: 1,
  //       time: { audio: 1, midi: 1000},
  //       token: 'b'
  //     },
  //     {
  //       tickLength: 1,
  //       time: { audio: 2, midi: 2000},
  //       token: 'c'
  //     }
  //   ]);
  // });
  //
  // it('returns multiple elements', () => {
  //   const parsedCycle = cycleParser('[ a b c d ]').content;
  //   const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
  //   assert.deepEqual(evaluatedCycle, [
  //     {
  //       tickLength: 1,
  //       time: { audio: 0, midi: 0},
  //       token: 'a'
  //     },
  //     {
  //       tickLength: 1,
  //       time: { audio: 1, midi: 1000},
  //       token: 'b'
  //     },
  //     {
  //       tickLength: 1,
  //       time: { audio: 2, midi: 2000},
  //       token: 'c'
  //     },
  //     {
  //       tickLength: 1,
  //       time: { audio: 3, midi: 3000},
  //       token: 'd'
  //     }
  //   ]);
  // });
  //
  // it('flattens nested cycles', () => {
  //   const parsedCycle = cycleParser('[ [ a ] [ b ] ]').content;
  //   const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
  //   assert.equal(evaluatedCycle.length, 2);
  //   assert.deepEqual(evaluatedCycle, [
  //     {
  //       tickLength: 1,
  //       time: { audio: 0, midi: 0},
  //       token: 'a'
  //     },
  //     {
  //       tickLength: 1,
  //       time: { audio: 2, midi: 2000},
  //       token: 'b'
  //     },
  //   ]);
  // });

  // it('evenly divides time in nested cycles', () => {
  //   const parsedCycle = cycleParser('[ [ a b ] [ c d ] ]').content;
  //   const evaluatedCycle = evaluateCycleWithDefaults(parsedCycle);
  //   assert.equal(evaluatedCycle.length, 4);
  //   assert.deepEqual(evaluatedCycle, [
  //     {
  //       tickLength: 1,
  //       time: { audio: 0, midi: 0},
  //       token: 'a'
  //     },
  //     {
  //       tickLength: 1,
  //       time: { audio: 2, midi: 2000},
  //       token: 'b'
  //     },
  //   ]);
  // });

});
