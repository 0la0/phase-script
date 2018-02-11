import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus, tickEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'trigger-box';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();

let instanceCnt = 0;

class TriggerBox extends BaseComponent {

  constructor() {
    super(style, markup);
    this.params = {
      frequency: 4,
      base: 0
    };
    this.audioPublishAddress;
    this.tickPublishAddress;
    this.inputIsMetronome = true;
  }

  connectedCallback() {
    this.id = `TriggerBox${instanceCnt++}`;
    this.metronomeSchedulable = this.buildMetronomeSchedulable();
    this.tickSchedulable = this.buildTickSchedulable();
    metronomeManager.getScheduler().register(this.metronomeSchedulable);

    this.visualizer = this.root.getElementById('visualizer');
    this.sendComboBox = this.root.getElementById('sendComboBox');
    this.sendTickComboBox = this.root.getElementById('sendTickComboBox');

    audioEventBus.subscribe({
      onNewSubscription: addresses => {
        const optionList = addresses.map(address => ({
          label: address, value: address
        }));
        setTimeout(() => this.sendComboBox.setOptions(optionList));
      }
    });

    tickEventBus.subscribe({
      onNewSubscription: addresses => {
        const optionList = addresses
          .filter(address => address !== this.id)
          .map(address => ({
            label: address, value: address
          }));
        setTimeout(() => this.sendTickComboBox.setOptions(optionList));
      }
    });
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
    tickEventBus.unsubscribe(this.tickEventSubscription);
  }

  setFrequency(frequency) {
    this.params.frequency = parseInt(frequency, 10);
  }

  setBase(base) {
    this.params.base = parseInt(base, 10);
  }

  onSendChange(value) {
    this.audioPublishAddress = value;
  }

  onTickOuputChange(value) {
    this.tickPublishAddress = value;
  }

  onInputSourceClick(event) {
    this.inputIsMetronome = !this.inputIsMetronome;
    if (this.inputIsMetronome) {
      tickEventBus.unsubscribe(this.tickSchedulable);
    }
    else {
      tickEventBus.subscribe(this.tickSchedulable);
    }
    this.visualizer.classList.remove('visualizer--active');
  }

  processTick(tickNumber, time) {
    if ((tickNumber - this.params.base) % this.params.frequency !== 0) {
      return;
    }

    if (this.tickPublishAddress && this.tickPublishAddress !== '-') {
      tickEventBus.publish({
        address: this.tickPublishAddress,
        time,
      });
      return;
    }

    audioEventBus.publish({
      address: this.audioPublishAddress,
      // TODO: set note value ??
      // note: note.getNormalizedNoteValue(scaleHelper, parseInt(this.baseNoteInput.value)),
      // value: note.velocity,
      onTime: time.audio,
      offTime: time.audio + metronome.getTickLength()
    });
  }

  render(tickNumber, lastTickNumber) {
    if ((tickNumber - this.params.base) % this.params.frequency === 0) {
      this.visualizer.classList.add('visualizer--active');
      return;
    }
    if ((tickNumber - this.params.base) % this.params.frequency === 1) {
      this.visualizer.classList.remove('visualizer--active');
      return;
    }
  }

  buildMetronomeSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        if (!this.inputIsMetronome) { return; }
        this.processTick(tickNumber, time);
      },
      render: (tickNumber, lastTickNumber) => {
        if (!this.inputIsMetronome) { return; }
        this.render(tickNumber, lastTickNumber);
      },
      start: () => {},
      stop: () => this.visualizer.classList.remove('visualizer--active')
    };
  }

  buildTickSchedulable() {
    let tickCounter = 0;
    return {
      address: this.id,
      onNext: (msg) => {
        this.processTick(tickCounter, msg.time);
        tickCounter++;
      },
    };
  }

  setOnRemoveCallback(onRemoveCallback) {
    this.onRemoveCallback = onRemoveCallback;
  }

  onRemove() {
    this.onRemoveCallback && this.onRemoveCallback();
  }

}

export default new Component(COMPONENT_NAME, TriggerBox);
