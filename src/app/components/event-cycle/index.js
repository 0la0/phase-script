import BaseComponent from 'common/util/base-component';
import { audioEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
import CycleManager from 'services/EventCycle/CycleManager';
import style from './event-cycle.css';
import markup from './event-cycle.html';

const CYCLE_STATE = {
  INVALID: ['background-color', '#DD7799'],
  QUEUED: ['background-color', '#7799DD'],
  PLAYING: ['background-color', 'none']
};
const KEY_CODE_ENTER = 13;

const dom = [ 'cycleElement', 'cycleInput', 'cycleState', 'errorDisplay' ];

export default class EventCycle extends BaseComponent {
  static get tag() {
    return 'event-cycle';
  }

  constructor() {
    super(style, markup, dom);
    this.cycleLength = 16;
    this.isOn = true;
    this.cycleManager = new CycleManager();
  }

  connectedCallback() {
    document.execCommand('defaultParagraphSeparator', false, 'p');
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
      render: () => {}
    });
    metronomeManager.getScheduler().register(this.metronomeSchedulable);

    const testCycleValue = `
      seq(
        p('m:127 m m').degrade(0.5),
        p("m", "120 40 20 [90 120]").every(2, speed(0.5).repeat(2).degrade(0.5))
      )
      addr('m').midiNote('TR-08', 9, 64, 10)

      seq(
        p('p', '0 50 120'),
        p('p', '0 50 120 50 0')
      )
      addr('p').midiCc('TR-08', 9, 46)
    `;
    this.dom.cycleInput.innerText = testCycleValue.trim();
    this.handleCycleChange(testCycleValue);
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  handleCycleChange(cycleString) {
    this.cycleManager.setCycleString(cycleString);
    if (!this.cycleManager.isValid()) {
      this.dom.cycleState.style.setProperty(...CYCLE_STATE.INVALID);
      this.dom.errorDisplay.classList.add('error-display--visible');
      this.dom.errorDisplay.innerText = this.cycleManager.errorMessage;
      return;
    }
    this.dom.cycleState.style.setProperty(...CYCLE_STATE.PLAYING);
    this.dom.errorDisplay.classList.remove('error-display--visible');
  }

  handleTick(tickNumber, time) {
    if (!this.isOn) { return; }
    const shouldRefresh = tickNumber % this.cycleLength === 0;
    try {
      this.cycleManager.getAudioEventsAndIncrement(time, metronomeManager.getMetronome().getTickLength(), shouldRefresh)
        .forEach(audioEvent => audioEventBus.publish(audioEvent));
    } catch(error) {
      console.log('TODO: handle', error.message);
      this.dom.errorDisplay.innerText = error.message;
      this.dom.errorDisplay.classList.add('error-display--visible');
    }
  }

  onToggleClick() {
    this.isOn = !this.isOn;
    this.cycleManager.resetCounter();
  }

  handleFontSizeChange(event) {
    this.dom.cycleInput.style.setProperty('font-size', `${event.target.value}px`);
  }
}
