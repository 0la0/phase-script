import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';
import { AUDIO_TICK_MULTIPLIER } from 'services/midi/util';
import { parser } from './CycleEvaluator';

const COMPONENT_NAME = 'event-cycle';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const CYCLE_INVALID = 'cycle-input--invalid';

const metronome = metronomeManager.getMetronome();
const dom = [ 'cycleLength', 'cycleElement', 'cycleInput', 'cycleIndicator', ];

class EventCycle extends BaseComponent {
  constructor() {
    super(style, markup, dom);
    this.cycleLength = 16;
    this.parentCycle = [];
  }

  connectedCallback() {
    this.dom.cycleLength.value = this.cycleLength;
    this.dom.cycleLength.addEventListener('blur', this.handleCycleLengthChange.bind(this));
    this.dom.cycleInput.addEventListener('keydown', event => event.stopPropagation());
    this.dom.cycleInput.addEventListener('keyup', event => this.handleCycleChange(event.target.value));
    this.metronomeSchedulable = this.buildMetronomeSchedulable();
    metronomeManager.getScheduler().register(this.metronomeSchedulable);

    // for testing
    const testCycleValue = 'a:48 a:60 , a:72';
    this.dom.cycleInput.value = testCycleValue;
    this.handleCycleChange(testCycleValue);
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  handleCycleLengthChange(event) {
    this.cycleLength = parseInt(event.target.value, 10);
  }

  scheduleCycleElement(cycleElement, time, duration) {
    const [ address, noteString ] = cycleElement.split(':');
    const intNote = parseInt(noteString, 10);
    const note = isNaN(intNote) ? undefined : intNote;
    audioEventBus.publish({ address, time, duration, note, });
  }

  evaluateCycle(tickNumber, time, tickLength, cycle, cycleDuration) {
    const elementDuration = cycleDuration / cycle.length;
    cycle.forEach((element, index) => {
      const timeObj = {
        audio: time.audio + (index * cycleDuration),
        midi: time.midi + (index * cycleDuration * AUDIO_TICK_MULTIPLIER),
      };
      if (Array.isArray(element)) {
        this.evaluateCycle(tickNumber, timeObj, tickLength, element, elementDuration);
      }
      else {
        this.scheduleCycleElement(element, timeObj, tickLength);
      }
    });
  }

  handleCycleChange(cycleString) {
    const parsedCycles = parser(cycleString);
    if (!parsedCycles.ok) {
      this.dom.cycleInput.classList.add(CYCLE_INVALID);
      return;
    }
    this.dom.cycleInput.classList.remove(CYCLE_INVALID);
    this.parentCycle = parsedCycles.content;
  }

  triggerCycle(tickNumber, time) {
    if (!this.parentCycle || !this.parentCycle.length) { return; }
    const tickLength = metronome.getTickLength();
    const cycleDuration = (tickLength * this.cycleLength) / this.parentCycle.length;
    this.evaluateCycle(tickNumber, time, tickLength, this.parentCycle, cycleDuration);
  }

  buildMetronomeSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        if (tickNumber % this.cycleLength === 0) {
          this.triggerCycle(tickNumber, time);
        }
      },
      render: (tickNumber) => {
        const cycleModulo = tickNumber % this.cycleLength;
        if (cycleModulo === 0) {
          this.dom.cycleIndicator.classList.add('cycle-inicator--active');
        } else if (cycleModulo === 1) {
          this.dom.cycleIndicator.classList.remove('cycle-inicator--active');
        }
      },
      start: () => {},
      stop: () => {}
    };
  }
}

export default new Component(COMPONENT_NAME, EventCycle);
