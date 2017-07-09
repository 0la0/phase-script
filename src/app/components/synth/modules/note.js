export default class Note {

  constructor(value, duration, velocity) {
    this.value = value;
    this.duration = duration;
    this.velocity = velocity;
  }

  getNormalizedNoteValue(scaleHelper, baseNote) {
    return scaleHelper.getNoteFromNormalizedValue(this.value, baseNote);
  }

}
