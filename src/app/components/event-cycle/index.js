import BaseComponent from 'common/util/base-component';
import { audioEventBus, eventBus } from 'services/EventBus';
import Subscription from 'services/EventBus/Subscription';
import metronomeManager from 'services/metronome/metronomeManager';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
import CycleManager from 'services/EventCycle/CycleManager';
import { uuid } from 'services/Math';
import style from './event-cycle.css';
import markup from './event-cycle.html';

const KEY_CODE_ENTER = 13;
const cssClass = {
  errorDisplay: 'error-display--visible',
  pendingChanges: 'pending-changes--active',
};
const dom = [ 'cycleInput', 'toggleButton', 'pendingChanges', 'errorDisplay' ];

export default class EventCycle extends BaseComponent {
  static get tag() {
    return 'event-cycle';
  }

  constructor() {
    super(style, markup, dom);
    this.cycle = uuid();
    this.cycleLength = 16;
    this.isOn = true;
    this.requestOn = false;
    this.cycleManager = new CycleManager();
    this.dataStoreSubscription = new Subscription('DATA_STORE', this.handleDataStoreUpdate.bind(this));
    this.dom.toggleButton.addEventListener('click', this.handleToggleClick.bind(this));
  }

  connectedCallback() {
    this.dom.cycleInput.addEventListener('keydown', event => {
      event.stopPropagation();
      if (event.keyCode === KEY_CODE_ENTER && event.metaKey) {
        event.preventDefault();
        this.handleCycleChange(this.dom.cycleInput.innerText);
        return;
      }
      this.dom.pendingChanges.classList.add(cssClass.pendingChanges);
    });
    this.metronomeSchedulable = new MetronomeScheduler({
      processTick: this.handleTick.bind(this),
      stop: () => this.cycleManager.stop(),
    });
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
    eventBus.subscribe(this.dataStoreSubscription);

    const testCycleValue = `
      seq(
        p("a", "48 60 60 72")
      )
      addr('a').envSin(0, 0, 400).gain(0.5).dac()
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
      this.dom.errorDisplay.classList.add(cssClass.errorDisplay);
      this.dom.errorDisplay.innerText = this.cycleManager.errorMessage;
      this.dom.pendingChanges.classList.remove(cssClass.pendingChanges);
      return;
    }
    this.dom.errorDisplay.classList.remove(cssClass.errorDisplay);
    this.dom.pendingChanges.classList.remove(cssClass.pendingChanges);
  }

  handleTick(tickNumber, time) {
    if (!this.isOn) { return; }
    const shouldRefresh = tickNumber % this.cycleLength === 0;
    if (this.requestOn) {
      if (shouldRefresh) {
        this.requestOn = false;
      } else {
        return;
      }
    }
    try {
      this.cycleManager.getAudioEventsAndIncrement(time, metronomeManager.getMetronome().getTickLength(), shouldRefresh)
        .forEach(audioEvent => audioEventBus.publish(audioEvent));
    } catch(error) {
      this.dom.errorDisplay.innerText = error.message;
      this.dom.errorDisplay.classList.add(cssClass.errorDisplay);
    }
  }

  handleDataStoreUpdate(obj) {
    requestAnimationFrame(() => {
      this.dom.cycleInput.style.setProperty('font-size', `${obj.dataStore.fontSize}px`);
    });
  }

  handleToggleClick() {
    this.isOn = !this.isOn;
    if (!this.isOn) {
      this.cycleManager.stop();
      this.dom.toggleButton.innerText = 'Off';
    } else {
      this.requestOn = true;
      this.dom.toggleButton.innerText = 'Active';
    }
  }
}
