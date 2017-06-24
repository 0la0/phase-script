import BaseComponent from '../_util/base-component';
import Component from '../_util/component';
import metronomeManager from '../../metronome/metronomeManager';
import {dorian, major, aeolian, minorPentatonic, wholeHalfDiminished} from '../../scale/scales';
import ScaleHelper from '../../scale/scaleHelper';
import provideEventBus from '../../EventBus/eventBusProvider';

const COMPONENT_NAME = 'synth-driver';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const eventBus = provideEventBus();
let baseNote = 60;
const valueFeed = new Array(16).fill(null).map(nullVal => getPosNeg() * 1 * Math.random());
let index = 0;
const scaleHelper = new ScaleHelper(minorPentatonic);

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


class SynthDriver extends BaseComponent {

  constructor() {
    super(style, markup);
  }

  connectedCallback() {
    const schedulable = this.buildSchedulable();
    const scheduler = metronomeManager.getScheduler();
    scheduler.register(schedulable);
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  buildSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        if (tickNumber % 2 !== 0) return;

        const midiMessage = {
          command: 9,
          status: 1,
          note: getNextNote(),
          value: 64
        };

        const offMessage = Object.assign({}, midiMessage);
        offMessage.command = 8;
        let offTime = time.midi + 80;
        if (Math.random() < 0.3) {
          offTime += 120 * Math.random();
        }

        eventBus.publish({
          address: 'TB-03',
          note: getNextNote(),
          value: 64,
          isOn: true,
          time: time.midi
        });
        eventBus.publish({
          address: 'TB-03',
          note: getNextNote(),
          value: 64,
          isOn: false,
          time: offTime
        });

      },
      render: (beatNumber, lastBeatNumber) => {},
      start: () => console.log('synth start'),
      stop: () => console.log('synth stop')
    };
  }

}

export default new Component(COMPONENT_NAME, SynthDriver);
