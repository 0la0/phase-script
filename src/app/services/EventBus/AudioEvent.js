export default class AudioEvent {
  constructor(address, note, time) {
    this.address = address;
    this.note = note;
    this.time = time;
  }

  setAddress(address) {
    this.address = address;
    return this;
  }

  setNote(note) {
    this.note = note;
    return this;
  }

  setTime(time) {
    this.time = time;
    return this;
  }

  clone() {
    return new AudioEvent(this.address, this.note, this.time.clone());
  }
}
