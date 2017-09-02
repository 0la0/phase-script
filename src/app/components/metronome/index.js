import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'metronome-ctrl';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();

class Metronome extends BaseComponent {

  constructor() {
    super(style, markup);
    this.isRunning = false;
    this.metronomeButton = this.root.getElementById('metronome-button');
    this.input = this.root.getElementById('metronome-input');
    this.input.value = metronome.getTempo();
    this.input.addEventListener('change', $event => {
      const value = parseInt(this.input.value);
      metronome.setTempo(value);
    });
  }

  connectedCallback() {

    window.addEventListener('keydown', $event => {
      if ($event.key !== ' ') {
        return;
      }
      $event.preventDefault();
      $event.stopPropagation();
      this.metronomeButton.trigger(true);
    });

    this.graphicsChannel = new BroadcastChannel('GRAPHICS_CHANNEL');

    const schedulable = {
      processTick: (tickNumber, time) => {},
      render: (beatNumber, lastBeatNumber) => {
        this.graphicsChannel.postMessage({beatNumber, lastBeatNumber});
      },
      start: () => {},
      stop: () => {}
    };
    const scheduler = metronomeManager.getScheduler();
    scheduler.register(schedulable);
  }

  onMetronomeClick() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      metronome.start();
    }
    else {
      metronome.stop();
    }
  }

  disconnectedCallback() {
    metronome.stop();
  };

}

export default new Component(COMPONENT_NAME, Metronome);
