import buildSequence from './sequenceGenerator';

export default class NoteSequence {
  constructor(numTicks) {
    this.sequence = buildSequence(numTicks);
  }

  getNoteByTick(tickIndex) {
    return this.sequence.find(note => note.startTick === tickIndex);
  }

  addNote(note) {
    this.sequence.push(note);
  }

  removeNote(targetNote) {
    this.sequence = this.sequence.filter(note => note !== targetNote);
  }

  getNextNoteIndex(tickIndex) {
    if (this.getNoteByTick(tickIndex)) {
      return tickIndex;
    }
    const sortedNotes = this.sequence
      .filter(note => note.startTick > tickIndex)
      .sort((a, b) => (a.startTick - tickIndex) - (b.startTick - tickIndex));
    if (sortedNotes && sortedNotes[0]) {
      return sortedNotes[0].startTick;
    }
  }
}
