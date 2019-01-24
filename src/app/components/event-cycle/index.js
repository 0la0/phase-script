import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
import CycleManager from 'services/EventCycle/CycleManager';
import style from './event-cycle.css';
import markup from './event-cycle.html';

const CYCLE_ACTIVE = 'cycle-inicator--active';
const CYCLE_STATE = {
  INVALID: ['background-color', '#DD7799'],
  QUEUED: ['background-color', '#7799DD'],
  PLAYING: ['background-color', 'none']
};
const KEY_CODE_ENTER = 13;

const dom = [ 'cycleLength', 'cycleElement', 'cycleInput', 'cycleIndicator', 'cycleState' ];

class EventCycle extends BaseComponent {
  constructor() {
    super(style, markup, dom);
    this.cycleLength = 16;
    this.isOn = true;
    this.cycleManager = new CycleManager();
  }

  connectedCallback() {
    this.dom.cycleLength.value = this.cycleLength;
    this.dom.cycleLength.addEventListener('blur', this.handleCycleLengthChange.bind(this));
    this.dom.cycleInput.addEventListener('keydown', event => {
      event.stopPropagation();
      if (event.keyCode === KEY_CODE_ENTER && event.metaKey) {
        event.preventDefault();
        this.handleCycleChange(this.dom.cycleInput.innerText);
        return;
      }
      this.dom.cycleState.style.setProperty(...CYCLE_STATE.QUEUED);
    });
    this.metronomeSchedulable = new MetronomeScheduler({
      processTick: this.handleTick.bind(this),
      render: this.handleTickRender.bind(this)
    });
    metronomeManager.getScheduler().register(this.metronomeSchedulable);

    // for testing
    // const testCycleValue = 'a:48 a:60 , a:72\n   \na a a';
    const testCycleValue = `
      seq([
        every(4, reverse()) (pattern("a:48 a:60 , a:72"))
      ])

      addr("a") (osc.sin(10, 10, 100)) (gain(0.5)) (dac())
    `;
    this.dom.cycleInput.innerText = testCycleValue;
    this.handleCycleChange(testCycleValue);
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  handleCycleLengthChange(event) {
    this.cycleLength = parseInt(event.target.value, 10);
  }

  handleCycleChange(cycleString) {
    this.cycleManager.setCycleString(cycleString);
    if (!this.cycleManager.isValid()) {
      this.dom.cycleState.style.setProperty(...CYCLE_STATE.INVALID);
      return;
    }
    this.dom.cycleState.style.setProperty(...CYCLE_STATE.PLAYING);
  }

  handleTick(tickNumber, time) {
    if (!this.isOn) { return; }
    // if (tickNumber % this.cycleLength !== 0) { return; }
    // const audioCycleDuration = metronomeManager.getMetronome().getTickLength() * this.cycleLength;
    // this.cycleManager.getAudioEventsAndIncrement(time);
    // const schedulables = this.cycleManager.getAudioEventsAndIncrement(audioCycleDuration, time);
    // audioEvents
    const shouldRefresh = tickNumber % this.cycleLength === 0;
    this.cycleManager.getAudioEventsAndIncrement(time, metronomeManager.getMetronome().getTickLength(), shouldRefresh)
      .forEach(audioEvent => audioEventBus.publish(audioEvent));
      // .forEach(({ element, timeObj}) => {
      //   const { address, note } = parseToken(element);
      //   audioEventBus.publish(new AudioEvent(address, note, timeObj));
      // });
  }

  handleTickRender(tickNumber) {
    const cycleModulo = tickNumber % this.cycleLength;
    if (cycleModulo === 0) {
      this.dom.cycleIndicator.classList.add(CYCLE_ACTIVE);
    } else if (cycleModulo === 1) {
      this.dom.cycleIndicator.classList.remove(CYCLE_ACTIVE);
    }
  }

  onToggleClick() {
    this.isOn = !this.isOn;
    this.cycleManager.resetCounter();
  }
}

export default new Component('event-cycle', EventCycle);
