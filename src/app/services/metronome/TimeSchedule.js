import { AUDIO_TICK_MULTIPLIER } from 'services/midi/util';

export default class TimeSchedule {
  constructor(audio, midi) {
    this.audio = audio || 0;
    this.midi = midi || 0;
  }

  add(delta) {
    this.audio = this.audio + delta;
    this.midi = this.midi + delta * AUDIO_TICK_MULTIPLIER;
    return this;
  }

  addMidi(delta) {
    this.midi = this.midi + delta;
    return this;
  }

  addAudio(delta) {
    this.audio = this.audio + delta;
    return this;
  }

  copy(timeSchedule) {
    if (!(timeSchedule instanceof TimeSchedule)) {
      throw new Error('TimeSchedule.copy can only copy TimeSchedule', timeSchedule);
    }
    this.audio = timeSchedule.audio;
    this.midi = timeSchedule.midi;
  }

  clone() {
    return new TimeSchedule(this.audio, this.midi);
  }
}
