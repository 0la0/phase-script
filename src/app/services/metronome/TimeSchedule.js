import { AUDIO_TICK_MULTIPLIER } from 'services/midi/util';

export default class TimeSchedule {
  constructor(audio, midi) {
    this.audio = audio;
    this.midi = midi;
  }

  add(delta) {
    this.audio = this.audio + delta;
    this.midi = this.midi + delta * AUDIO_TICK_MULTIPLIER;
    return this;
  }

  clone() {
    return new TimeSchedule(this.audio, this.midi);
  }
}
