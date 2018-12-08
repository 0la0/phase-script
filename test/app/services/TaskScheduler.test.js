import assert from 'assert';
import { enqueueTask, enqueueMicroTask } from 'services/TaskScheduler';

describe('TaskScheduler', () => {
  it('executes tasks and microtasks in the correct order', (done) => {
    const runTimeResult = [];
    const expectedValues = [ 'one', 'six', 'four', 'five', 'two', 'three' ];
    function pushAssert(val) {
      runTimeResult.push(val);
      assert.deepEqual(runTimeResult, expectedValues.slice(0, runTimeResult.length));
      if (runTimeResult.length === expectedValues.length) {
        done();
      }
    }
    pushAssert('one');
    enqueueTask(() => pushAssert('two'));
    enqueueTask(() => pushAssert('three'));
    enqueueMicroTask(() => pushAssert('four'));
    enqueueMicroTask(() => pushAssert('five'));
    pushAssert('six');
  });
});
