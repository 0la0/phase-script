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

    const valueFeed = new Array(64).fill(null)
      .map((nullVal, index) => {
        const value = getPosNeg() * 1 * Math.random();
        const duration = Math.floor(4 + 4 * Math.random());
        //const velocity = Math.floor(127 * Math.random());
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
        // console.log(index, isIncluded);
        return isIncluded;
      })
      .forEach(entry => this.sequence.set(entry.startTick, entry.note));
  }

  getNoteByTick(tickIndex) {
    return this.sequence.has(tickIndex)
      && this.sequence.get(tickIndex);
  }

}
