import BaseComponent from 'common/util/base-component';
import { audioEventBus, eventBus } from 'services/EventBus';
import Subscription from 'services/EventBus/Subscription';
import metronomeManager from 'services/metronome/metronomeManager';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
import CycleManager from 'services/EventCycle/CycleManager';
import { uuid } from 'services/Math';
import style from './event-cycle.css';
import markup from './event-cycle.html';

const CYCLE_STATE = {
  INVALID: ['background-color', '#DD7799'],
  QUEUED: ['background-color', '#7799DD'],
  PLAYING: ['background-color', 'none']
};
const KEY_CODE_ENTER = 13;

const dom = [ 'cycleElement', 'cycleInput', 'cycleState', 'errorDisplay' ];

// TODO: parent component to manage all even cycle components
export default class EventCycle extends BaseComponent {
  static get tag() {
    return 'event-cycle';
  }

  constructor() {
    super(style, markup, dom);
    this.cycle = uuid();
    this.cycleLength = 16;
    this.isOn = true;
    this.cycleManager = new CycleManager();
    this.dataStoreSubscription = new Subscription('DATA_STORE', this.handleDataStoreUpdate.bind(this));
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
    });
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
    eventBus.subscribe(this.dataStoreSubscription);

    const testCycleValue = `
      seq(
        p("a", "48 60 60 72")
      )
      addr('a').envSin(0, 0, 400).gain(0.5, 0x1).dac()
    `;
    this.dom.cycleInput.innerText = testCycleValue.trim();
    this.handleCycleChange(testCycleValue);
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
    eventBus.unsubscribe(this.dataStoreSubscription);
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
      console.log('TODO: handle', error);
      this.dom.errorDisplay.innerText = error.message;
      this.dom.errorDisplay.classList.add('error-display--visible');
    }
  }

  handleDataStoreUpdate(obj) {
    this.dom.cycleInput.style.setProperty('font-size', `${obj.dataStore.fontSize}px`);
  }

  onToggleClick() {
    this.isOn = !this.isOn;
    this.cycleManager.resetCounter();
  }
}
