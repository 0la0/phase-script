export default class AudioEvent {
  constructor(address = '', note = 60, time = 0) {
    this.address = address;
    this.note = note;
    this.time = time;
  }

  setAddress(address) {
    this.address = address;
    return this;
  }

  getAddress() {
    return this.address;
  }

  setNote(note) {
    this.note = note;
    return this;
  }

  getNote() {
    return this.note;
  }

  setTime(time) {
    this.time = time;
    return this;
  }

  getTime() {
    return this.time;
  }

  clone() {
    return new AudioEvent(this.address, this.note, this.time.clone());
  }
}
