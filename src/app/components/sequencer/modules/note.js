export default class Note {
  constructor(value, duration, velocity, startTick) {
    this.value = value;
    this.duration = duration;
    this.velocity = velocity;
    this.startTick = startTick;
  }

  getNormalizedNoteValue(scaleHelper, baseNote) {
    return scaleHelper.getNoteFromNormalizedValue(this.value, baseNote);
  }

  clone() {
    return new Note(this.value, this.duration, this.velocity, this.startTick);
  }
}
