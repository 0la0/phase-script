
import {getMessageFromObject} from './midi/midiEventBus';
import {dorian, major, aeolian, minorPentatonic, wholeHalfDiminished} from './scale/scales';
import ScaleHelper from './scale/scaleHelper';

let baseNote = 60;
const valueFeed = new Array(16).fill(null).map(nullVal => getPosNeg() * 1 * Math.random());
let index = 0;
const scaleHelper = new ScaleHelper(aeolian);

function getPosNeg() {return Math.random() < 0.5 ? -1 : 1;}

const keyPress = {
  38: () => baseNote++,
  40: () => baseNote--
};

window.onkeyup = event => {
  const keyStrategy = keyPress[event.keyCode];
  keyStrategy && keyStrategy();
};

function getNextNote() {
  const currentVal = valueFeed[index];
  const someNote = scaleHelper.getNoteFromNormalizedValue(currentVal, baseNote);
  index = (++index < valueFeed.length) ? index : 0;
  return someNote;
}

export default function buildSchedulable(tb03) {

  return {
    processTick: (tickNumber, time) => {
      // if (tickNumber % 2 !== 0) {
      //   return;
      // }
      //console.log('schedule', time.midi);
      time = time.midi + 40; // adding 40 seems to make it sync with the web audio schedule
      const midiMessage = {
        command: 9,
        status: 1,
        note: getNextNote(),
        //note: 60,
        value: 64
      };

      const offMessage = Object.assign({}, midiMessage);
      offMessage.command = 8;
      let offTime = time + 80;
      if (Math.random() < 0.3) {
        offTime += 120 * Math.random();
      }

      tb03.output.send(getMessageFromObject(midiMessage), time);
      tb03.output.send(getMessageFromObject(offMessage), offTime);
    },
    render: (beatNumber, lastBeatNumber) => {},
    start: () => console.log('tb03 start'),
    stop: () => console.log('tb03 stop')
  }

}
