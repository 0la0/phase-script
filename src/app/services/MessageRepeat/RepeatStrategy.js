import { IntArray } from 'services/Math';
import TimeSchedule from 'services/metronome/TimeSchedule';

function getMaxFromSchedules(schedules) {
  return schedules.reduce((max, schedule) => {
    if (schedule.audio > max.audio) {
      max.copy(schedule);
    }
    return max;
  }, new TimeSchedule());
}

class RepeatStrategy {
  constructor(numRepeats, repeatFrequency, tickLength, time) {
    this.numRepeats = numRepeats;
    this.repeatFrequency = repeatFrequency;
    this.tickLength = tickLength;
    this.time = time;
  }

  linear() {
    return IntArray(this.numRepeats).map((index) => {
      const offset = index * this.tickLength * this.repeatFrequency;
      return this.time.clone().add(offset);
    });
  }

  rampDown(baseTime) {
    const _baseTime = baseTime || this.time;
    let diff = 4;
    return IntArray(this.numRepeats).map((index) => {
      if (index === 0) {
        return _baseTime.clone();
      }
      const offset = this.tickLength * this.repeatFrequency * diff;
      diff /= 2;
      return _baseTime.clone().add(offset);
    });
  }

  rampUp(baseTime) {
    const _baseTime = baseTime || this.time;

    let count = 0;
    let diff = 4;
    return IntArray(this.numRepeats).map((index) => {
      if (index === 0) {
        return _baseTime.clone();
      }
      const delta = this.tickLength * this.repeatFrequency * diff;
      const offset = count + delta;
      diff /= 2;
      count += delta;
      return _baseTime.clone().add(offset);
    });
  }

  uShaped(baseTime) {
    const rampUpSchedules = this.rampUp(baseTime);
    const max = getMaxFromSchedules(rampUpSchedules);
    const rampDownSchedules = this.rampDown(max);
    return rampUpSchedules.concat(rampDownSchedules);
  }

  nShaped(baseTime) {
    const rampDownSchedules = this.rampDown(baseTime);
    const max = getMaxFromSchedules(rampDownSchedules);
    const rampUpSchedules = this.rampUp(max);
    return rampDownSchedules.concat(rampUpSchedules);
  }
}

export default function getTimeSchedules(numRepeats, repeatFrequency, repeatModifier, tickLength, time) {
  if (numRepeats === 1) {
    return [ time ];
  }
  const repeatStrategy = new RepeatStrategy(numRepeats, repeatFrequency, tickLength, time);
  return repeatStrategy[repeatModifier]().sort((a, b) => a.audio - b.audio);
}
