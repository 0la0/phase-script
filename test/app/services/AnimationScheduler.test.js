import assert from 'assert';
import AnimationScheduler from '../../../src/app/services/AnimationScheduler';

describe('AnimationScheduler', () => {
  it('returns false when empty', () => {
    const animationScheduler = new AnimationScheduler();
    assert.equal(animationScheduler.schedules.length, 0);
    assert.ok(!animationScheduler.getLatestSchedule());
  });

  it('returns a single item', () => {
    const animationScheduler = new AnimationScheduler();
    animationScheduler.submit(0);
    assert.equal(animationScheduler.getLatestSchedule(0), 0);
    assert.equal(animationScheduler.schedules.length, 0);
    assert.ok(!animationScheduler.getLatestSchedule(1));
  });

  it('returns the latest item and clears the queue', () => {
    const animationScheduler = new AnimationScheduler();
    animationScheduler.submit(0);
    assert.equal(animationScheduler.getLatestSchedule(0), 0);
    assert.equal(animationScheduler.schedules.length, 0);
    assert.ok(!animationScheduler.getLatestSchedule(1));
    animationScheduler.submit(1);
    animationScheduler.submit(2);
    assert.equal(animationScheduler.getLatestSchedule(1), 1);
    assert.equal(animationScheduler.schedules.length, 1);
    assert.equal(animationScheduler.getLatestSchedule(2), 2);
    assert.equal(animationScheduler.schedules.length, 0);
    assert.ok(!animationScheduler.getLatestSchedule(3));
  });

  it('returns the latest item and clears the queue', () => {
    const animationScheduler = new AnimationScheduler();
    animationScheduler.submit(0);
    animationScheduler.submit(1);
    animationScheduler.submit(2);
    animationScheduler.submit(3);
    animationScheduler.submit(4);
    assert.equal(animationScheduler.getLatestSchedule(2.1), 2);
    assert.equal(animationScheduler.schedules.length, 2);
    assert.equal(animationScheduler.getLatestSchedule(3.9), 3);
    assert.equal(animationScheduler.schedules.length, 1);
    assert.equal(animationScheduler.getLatestSchedule(4), 4);
    assert.equal(animationScheduler.schedules.length, 0);
    assert.ok(!animationScheduler.getLatestSchedule(4.1));
  });
});
