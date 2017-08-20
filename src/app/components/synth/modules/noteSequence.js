import Note from './note';

const PROB_LENGTH = 8;
const noteFilterStrategy = {
  0: () => Math.random() < 0.5,
  1: () => Math.random() < 0.03,
  2: () => Math.random() < 0.05,
  3: () => Math.random() < 0.1,
  4: () => Math.random() < 0.5,
  5: () => Math.random() < 0.05,
  6: () => Math.random() < 0.03,
  7: () => Math.random() < 0.03
};

function buildSequence(numTicks) {
  return new Array(numTicks).fill(null)
    .map((nullVal, index) => {
      const value = getPosNeg() * 1 * Math.random();
      const duration = Math.floor(4 + 4 * Math.random());
      const velocity = 64;
      return new Note(value, duration, velocity, index);
    })
    .filter((note, index) => {
      const lookup = index % PROB_LENGTH;
      const isIncluded = noteFilterStrategy[lookup]();
      return isIncluded;
    })
    .map((note, index, array) => {
      const nextNote = index < array.length - 1 ?
        array[index + 1] :
        {startTick: numTicks}

      let endTick;
      // Three choices for duration: note ends at next note, overlap (slide), short note
      const decision = Math.random();
      if (decision < 0.6) {
        // end at next note
        endTick = nextNote.startTick;
      }
      else if (decision < 0.9) {
        // overlap (slide)
        endTick = nextNote.startTick + 1;
      }
      else {
        // short
        endTick = note.startTick + 1;
      }
      note.duration = endTick - note.startTick;
      return note;
    });
}

const getPosNeg = () => Math.random() < 0.5 ? -1 : 1;

export default class NoteSequence {

  constructor(numTicks) {
    this.sequence = buildSequence(numTicks);
  }

  getNoteByTick(tickIndex) {
    return this.sequence.find(note => note.startTick === tickIndex);
  }

  removeNote(targetNote) {
    this.sequence = this.sequence.filter(note => note !== targetNote);
  }

}
