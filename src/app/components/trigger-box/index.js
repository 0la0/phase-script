import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import audioEventBus from 'services/AudioEventBus';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'trigger-box';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();

class TriggerBox extends BaseComponent {

  constructor() {
    super(style, markup);
    this.params = {
      frequency: 4,
      base: 0
    };
    this.publishAddress;
  }

  connectedCallback() {
    const schedulable = this.buildSchedulable();
    const scheduler = metronomeManager.getScheduler();
    scheduler.register(schedulable);

    this.visualizer = this.root.getElementById('visualizer');
    this.sendComboBox = this.root.getElementById('sendComboBox');

    audioEventBus.subscribe({
      onNewSubscription: addresses => {
        const optionList = addresses.map(address => ({
          label: address, value: address
        }));
        setTimeout(() => this.sendComboBox.setOptions(optionList));
      }
    });
  }

  setFrequency(frequency) {
    this.params.frequency = parseInt(frequency, 10);
  }

  setBase(base) {
    this.params.base = parseInt(base, 10);
  }

  onSendChange(value) {
    this.publishAddress = value;
  }

  trigger(tickNumber, time) {
    audioEventBus.publish({
      address: this.publishAddress,
      // TODO: set note value ??
      // note: note.getNormalizedNoteValue(scaleHelper, parseInt(this.baseNoteInput.value)),
      // value: note.velocity,
      onTime: time.audio,
      offTime: time.audio + metronome.getTickLength()
    });
  }

  buildSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        if ((tickNumber - this.params.base) % this.params.frequency !== 0) {
          return;
        }
        this.trigger(tickNumber, time);
      },
      render: (tickNumber, lastTickNumber) => {
        if ((tickNumber - this.params.base) % this.params.frequency === 0) {
          this.visualizer.classList.add('visualizer--active');
          return;
        }
        if ((tickNumber - this.params.base) % this.params.frequency === 1) {
          this.visualizer.classList.remove('visualizer--active');
          return;
        }
      },
      start: () => {},
      stop: () => this.visualizer.classList.remove('visualizer--active')
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
