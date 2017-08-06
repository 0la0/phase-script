import Note from './note';

const PROB_LENGTH = 8;
const noteFilterStrategy = {
  0: () => Math.random() < 0.7,
  1: () => Math.random() < 0.05,
  2: () => Math.random() < 0.1,
  3: () => Math.random() < 0.2,
  4: () => Math.random() < 0.7,
  5: () => Math.random() < 0.1,
  6: () => Math.random() < 0.05,
  7: () => Math.random() < 0.05
};

const getPosNeg = () => Math.random() < 0.5 ? -1 : 1;

export default class NoteSequence {

  constructor() {
    this.sequence = new Map();

    let valueFeed = new Array(64).fill(null)
      .map((nullVal, index) => {
        const value = getPosNeg() * 1 * Math.random();
        const duration = Math.floor(4 + 4 * Math.random());
        const velocity = 64;
        return new Note(value, duration, velocity);
      })
      .map((note, index) => ({
        note,
        startTick: index
      }))
      .filter((entry, index) => {
        const lookup = index % PROB_LENGTH;
        const isIncluded = noteFilterStrategy[lookup]();
        return isIncluded;
      });

    console.log('valueFeed', valueFeed);
    // now that all the notes have been created, recalculate the duration
    valueFeed = valueFeed.map((entry, index, array) => {
      const nextIndex = index >= array.length - 1 ? 0 : index + 1;
      const nextNote = array[nextIndex];

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
        endTick = entry.startTick + 1;
      }

      entry.note.duration = endTick - entry.startTick;
      return entry;
    });

    // set the sequence
    valueFeed.forEach(entry => this.sequence.set(entry.startTick, entry.note));
  }

  getNoteByTick(tickIndex) {
    return this.sequence.has(tickIndex)
      && this.sequence.get(tickIndex);
  }

}
