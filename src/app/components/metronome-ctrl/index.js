import BaseComponent from 'common/util/base-component';
import metronomeManager from 'services/metronome/metronomeManager';
import { eventBus } from 'services/EventBus';
import Subscription from 'services/EventBus/Subscription';
import style from './metronome-ctrl.css';
import markup from './metronome-ctrl.html';

export default class Metronome extends BaseComponent {
  static get tag() {
    return 'metronome-ctrl';
  }

  constructor() {
    super(style, markup, ['clockButton']);
    this.isRunning = false;
    this.spaceBarSubscription = new Subscription('KEY_SPACE', () => {
      event.preventDefault();
      event.stopPropagation();
      this.dom.clockButton.click();
    });
  }

  connectedCallback() {
    eventBus.subscribe(this.spaceBarSubscription);
  }

  disconnectedCallback() {
    eventBus.unsubscribe(this.spaceBarSubscription);
  }

  handleMasterClockClick() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      metronomeManager.getMetronome().start();
    }
    else {
      metronomeManager.getMetronome().stop();
    }
  }

  handleTempoChange(event) {
    const value = parseInt(event.target.value, 10);
    metronomeManager.getMetronome().setTempo(value);
  }
}
