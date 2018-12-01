import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
import cycleParser from 'services/EventCycle/Parser';
import evaluateCycle from 'services/EventCycle/Evaluator';

const COMPONENT_NAME = 'event-cycle';
import style from './event-cycle.css';
import markup from './event-cycle.html';

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
    this.metronomeSchedulable = new MetronomeScheduler({
      processTick: this.handleTick.bind(this),
      render: this.handleTickRender.bind(this)
    });
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

  handleCycleChange(cycleString) {
    const parsedCycles = cycleParser(cycleString);
    if (!parsedCycles.ok) {
      this.dom.cycleInput.classList.add(CYCLE_INVALID);
      return;
    }
    this.dom.cycleInput.classList.remove(CYCLE_INVALID);
    this.parentCycle = parsedCycles.content;
  }

  handleTick(tickNumber, time) {
    if (tickNumber % this.cycleLength !== 0) { return; }
    const tickLength = metronome.getTickLength();
    const audioCycleDuration = tickLength * this.cycleLength;
    const schedulables = evaluateCycle(time, tickLength, this.parentCycle, audioCycleDuration);
    schedulables.forEach(({ token, time, tickLength }) => this.scheduleCycleElement(token, time, tickLength));
  }

  handleTickRender(tickNumber) {
    const cycleModulo = tickNumber % this.cycleLength;
    if (cycleModulo === 0) {
      this.dom.cycleIndicator.classList.add('cycle-inicator--active');
    } else if (cycleModulo === 1) {
      this.dom.cycleIndicator.classList.remove('cycle-inicator--active');
    }
  }
}

export default new Component(COMPONENT_NAME, EventCycle);
