import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import graphicsChannel from 'services/BroadcastChannel';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'metronome-ctrl';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();

const titleSymbols = [ '\\', '|', '/', '-', ];

class Metronome extends BaseComponent {

  constructor() {
    super(style, markup);
    this.isRunning = false;
    this.metronomeButton = this.shadowRoot.getElementById('metronome-button');
    this.input = this.shadowRoot.getElementById('metronome-input');
    this.input.value = metronome.getTempo();
    this.input.addEventListener('change', $event => {
      const value = parseInt(this.input.value);
      metronome.setTempo(value);
    });
    this.titleIndex = 0;
  }

  connectedCallback() {
    this.titleElement = document.getElementsByTagName('title')[0];
    // console.log('titleElement', titleElement);

    window.addEventListener('keydown', $event => {
      if ($event.key !== ' ') {
        return;
      }
      $event.preventDefault();
      $event.stopPropagation();
      this.metronomeButton.trigger(true);
    });

    const schedulable = {
      processTick: (tickNumber, time) => {},
      render: (beatNumber, lastBeatNumber) => {
        graphicsChannel.postMessage({
          type: 'TICK',
          beatNumber,
          lastBeatNumber
        });
        if (beatNumber % 8 !== 0) { return; }
        const symbol = titleSymbols[ this.titleIndex++ % titleSymbols.length ];
        this.titleElement.innerText = `${symbol} ${symbol} ${symbol}`;
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
      this.titleElement.innerText = 'Audio Stopped';
    }
  }

  disconnectedCallback() {
    metronome.stop();
  };

}

export default new Component(COMPONENT_NAME, Metronome);
