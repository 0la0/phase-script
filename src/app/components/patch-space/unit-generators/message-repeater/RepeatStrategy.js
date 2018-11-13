import { AUDIO_TICK_MULTIPLIER } from 'services/midi/util';

function getMaxFromSchedules(schedules) {
  return schedules.reduce((max, schedule) => {
    if (schedule.audio > max.audio) { max.audio = schedule.audio; }
    if (schedule.midi > max.midi) { max.midi = schedule.midi; }
    return max;
  }, { audio: 0, midi: 0 });
}

class RepeatStrategy {
  constructor(numRepeats, repeatFrequency, tempo, tickLength, time) {
    this.numRepeats = numRepeats;
    this.repeatFrequency = repeatFrequency;
    this.tempo = tempo;
    this.tickLength = tickLength;
    this.time = time;
  }

  linear() {
    return new Array(this.numRepeats).fill(null)
      .map((n, index) => {
        const offset = index * this.tickLength * this.repeatFrequency;
        return {
          audio: this.time.audio + offset,
          midi: this.time.midi + offset * AUDIO_TICK_MULTIPLIER,
        };
      });
  }

  rampDown(baseTime) {
    const baseAudio = baseTime ? baseTime.audio : this.time.audio;
    const baseMidi = baseTime ? baseTime.midi : this.time.midi;
    let diff = 4; // TODO: set as param
    const offsetList = new Array(this.numRepeats).fill(null)
      .map((n, index, array) => {
        let offsetAudio = 0;
        let offsetMidi = 0;
        if (index !== 0) {
          const lastValue = array[index - 1];
          const offset = lastValue + this.tickLength * this.repeatFrequency * diff;
          offsetAudio = offset;
          offsetMidi = offset * AUDIO_TICK_MULTIPLIER;
          diff /= 2; // TODO: set as param
        }
        return {
          audio: baseAudio + offsetAudio,
          midi: baseMidi + offsetMidi,
        };
      });
    return offsetList;
  }

  rampUp(baseTime) {
    const baseAudio = baseTime ? baseTime.audio : this.time.audio;
    const baseMidi = baseTime ? baseTime.midi : this.time.midi;
    const rampDownSchedules = this.rampDown();
    const max = getMaxFromSchedules(rampDownSchedules);
    return rampDownSchedules.map(schedule => ({
      audio: max.audio - schedule.audio + baseAudio,
      midi: max.midi - schedule.midi + baseAudio,
    }));
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

export default function getTimeSchedules(numRepeats, repeatFrequency, repeatModifier, tempo, tickLength, time) {
   const repeatStrategy = new RepeatStrategy(numRepeats, repeatFrequency, tempo, tickLength, time);
   return repeatStrategy[repeatModifier]();
}
