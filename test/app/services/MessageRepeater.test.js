import assert from 'assert';
import getTimeSchedules from 'services/MessageRepeat/RepeatStrategy';
import TimeSchedule from 'services/metronome/TimeSchedule';

const REPEAT_MODIFIER = {
  LINEAR: 'linear',
  RAMP_DOWN: 'rampDown',
  RAMP_UP: 'rampUp',
  U_SHAPED: 'uShaped',
  N_SHAPED: 'nShaped'
};
const DEFAULTS = {
  TICK_LENGTH: 1
};

describe('MessageReapeater.RepeatStrategy', () => {
  it('returns the identity when numRepeats is one', () => {
    assert.deepEqual(
      getTimeSchedules(1, 1, REPEAT_MODIFIER.LINEAR, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [ new TimeSchedule() ]
    );

    assert.deepEqual(
      getTimeSchedules(1, 1, REPEAT_MODIFIER.RAMP_DOWN, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [ new TimeSchedule() ]
    );

    assert.deepEqual(
      getTimeSchedules(1, 1, REPEAT_MODIFIER.RAMP_UP, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [ new TimeSchedule() ]
    );

    assert.deepEqual(
      getTimeSchedules(1, 1, REPEAT_MODIFIER.U_SHAPED, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [ new TimeSchedule() ]
    );

    assert.deepEqual(
      getTimeSchedules(1, 1, REPEAT_MODIFIER.N_SHAPED, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [ new TimeSchedule() ]
    );
  });

  it('linear strategy', () => {
    assert.deepEqual(
      getTimeSchedules(4, 1, REPEAT_MODIFIER.LINEAR, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [
        { audio: 0, midi: 0 },
        { audio: 1, midi: 1000 },
        { audio: 2, midi: 2000 },
        { audio: 3, midi: 3000 },
      ]
    );

    assert.deepEqual(
      getTimeSchedules(4, 2, REPEAT_MODIFIER.LINEAR, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [
        { audio: 0, midi: 0 },
        { audio: 2, midi: 2000 },
        { audio: 4, midi: 4000 },
        { audio: 6, midi: 6000 },
      ]
    );

    assert.deepEqual(
      getTimeSchedules(4, 3, REPEAT_MODIFIER.LINEAR, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [
        { audio: 0, midi: 0 },
        { audio: 3, midi: 3000 },
        { audio: 6, midi: 6000 },
        { audio: 9, midi: 9000 },
      ]
    );
  });

  it('ramp down strategy', () => {
    assert.deepEqual(
      getTimeSchedules(4, 1, REPEAT_MODIFIER.RAMP_DOWN, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [
        { audio: 0, midi: 0 },
        { audio: 1, midi: 1000 },
        { audio: 2, midi: 2000 },
        { audio: 4, midi: 4000 },
      ]
    );

    assert.deepEqual(
      getTimeSchedules(8, 2, REPEAT_MODIFIER.RAMP_DOWN, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [
        { audio: 0, midi: 0 },
        { audio: 0.125, midi: 125 },
        { audio: 0.25, midi: 250 },
        { audio: 0.5, midi: 500 },
        { audio: 1, midi: 1000 },
        { audio: 2, midi: 2000 },
        { audio: 4, midi: 4000 },
        { audio: 8, midi: 8000 },
      ]
    );
  });

  it('ramp up strategy', () => {
    assert.deepEqual(
      getTimeSchedules(6, 1, REPEAT_MODIFIER.RAMP_UP, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [
        { audio: 0, midi: 0 },
        { audio: 4, midi: 4000 },
        { audio: 6, midi: 6000 },
        { audio: 7, midi: 7000 },
        { audio: 7.5, midi: 7500 },
        { audio: 7.75, midi: 7750 },
      ]
    );

    assert.deepEqual(
      getTimeSchedules(6, 2, REPEAT_MODIFIER.RAMP_UP, DEFAULTS.TICK_LENGTH, new TimeSchedule()),
      [
        { audio: 0, midi: 0 },
        { audio: 8, midi: 8000 },
        { audio: 12, midi: 12000 },
        { audio: 14, midi: 14000 },
        { audio: 15, midi: 15000 },
        { audio: 15.5, midi: 15500 },
      ]
    );
  });
});
