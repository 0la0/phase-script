import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus } from 'services/EventBus';
import AudioEvent from 'services/EventBus/AudioEvent';
import metronomeManager from 'services/metronome/metronomeManager';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
import cycleParser from 'services/EventCycle/Parser';
import evaluateCycle from 'services/EventCycle/Evaluator';
import parseToken from 'services/EventCycle/Tokenizer';
import style from './event-cycle.css';
import markup from './event-cycle.html';

const CYCLE_INVALID = 'cycle-input--invalid';
const CYCLE_ACTIVE = 'cycle-inicator--active';

const dom = [ 'cycleLength', 'cycleElement', 'cycleInput', 'cycleIndicator', ];

// UP NEXT:
// * BUTTON TO SIGNAL ON / OFF
// * ONLY SUBMIT ON COMMAND+ENTER (AND / OR BUTTON)
class EventCycle extends BaseComponent {
  constructor() {
    super(style, markup, dom);
    this.cycleLength = 16;
    this.parsedCycles = [];
    this.cycleCounter = 0;
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

  handleCycleChange(cycleString) {
    const parsedCycles = cycleParser(cycleString);
    const isValid = parsedCycles.every(cycle => cycle.ok);
    // TODO: line level validation / error highlighting
    if (!isValid) {
      this.dom.cycleInput.classList.add(CYCLE_INVALID);
      return;
    }
    this.dom.cycleInput.classList.remove(CYCLE_INVALID);
    this.parsedCycles = parsedCycles;
  }

  handleTick(tickNumber, time) {
    if (tickNumber % this.cycleLength !== 0) { return; }
    const audioCycleDuration = metronomeManager.getMetronome().getTickLength() * this.cycleLength;
    const cycleIndex = this.cycleCounter % this.parsedCycles.length;
    if (this.parsedCycles[cycleIndex]) {
      const schedulables = evaluateCycle(time, this.parsedCycles[cycleIndex].content, audioCycleDuration);
      schedulables.forEach(({ token, time }) => {
        const { address, note } = parseToken(token);
        audioEventBus.publish(new AudioEvent(address, note, time));
      });
    }
    this.cycleCounter++;
  }

  handleTickRender(tickNumber) {
    const cycleModulo = tickNumber % this.cycleLength;
    if (cycleModulo === 0) {
      this.dom.cycleIndicator.classList.add(CYCLE_ACTIVE);
    } else if (cycleModulo === 1) {
      this.dom.cycleIndicator.classList.remove(CYCLE_ACTIVE);
    }
  }
}

export default new Component('event-cycle', EventCycle);
