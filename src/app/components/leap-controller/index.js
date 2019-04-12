import BaseComponent from 'common/util/base-component';
import metronomeManager from 'services/metronome/metronomeManager';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
import leapHandler from 'services/leap/LeapHandler';
import { audioEventBus } from 'services/EventBus';
import AudioEvent from 'services/EventBus/AudioEvent';
import TimeSchedule from 'services/metronome/TimeSchedule';
import style from './leap-controller.css';
import markup from './leap-controller.html';

export default class LeapController extends BaseComponent {
  static get tag() {
    return 'leap-controller';
  }

  constructor() {
    super(style, markup, []);
    this.isOn = false;
    this.eventAddress = 'event-address';
    this.distanceAddress = 'distance-address';
    this.xAddress = 'x-address';
    this.yAddress = 'y-address';
  }

  connectedCallback() {
    this.metronomeSchedulable = new MetronomeScheduler({
      render: this.handleLeapFrame.bind(this)
    });
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  handleLeapFrame() {
    if (!this.isOn) {
      return;
    }
    const { leftHandEvents, rightHandEvents } = leapHandler.update();
    if (leftHandEvents) {
      audioEventBus.publish(new AudioEvent(this.distanceAddress, leftHandEvents.distance, new TimeSchedule()));
      audioEventBus.publish(new AudioEvent(this.xAddress, leftHandEvents.x, new TimeSchedule()));
      audioEventBus.publish(new AudioEvent(this.yAddress, leftHandEvents.y, new TimeSchedule()));
    }
    if (rightHandEvents && rightHandEvents.triggerEvent) {
      audioEventBus.publish(new AudioEvent(this.eventAddress, undefined, new TimeSchedule()));
    }
  }

  handleEventAddressChange(event) {
    this.eventAddress = event.target.value;
  }

  handleDistanceAddressChange(event) {
    this.distanceAddress = event.target.value;
  }

  handleXAddressChange(event) {
    this.xAddress = event.target.value;
  }

  handleYAddressChange(event) {
    this.yAddress = event.target.value;
  }
  onToggleClick(event) {
    this.isOn = event.target.isOn;
  }
}
