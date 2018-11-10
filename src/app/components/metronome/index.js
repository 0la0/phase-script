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
    super(style, markup, ['metronomeButton', 'metronomeInput']);
    this.isRunning = false;
    this.dom.metronomeInput.value = metronome.getTempo();
    this.dom.metronomeInput.addEventListener('change', $event => {
      const value = parseInt(this.dom.metronomeInput.value);
      metronome.setTempo(value);
    });
    this.titleIndex = 0;
  }

  connectedCallback() {
    this.titleElement = document.getElementsByTagName('title')[0];
    window.addEventListener('keydown', $event => {
      if ($event.code !== 'Space') { return; }
      $event.preventDefault();
      $event.stopPropagation();
      this.dom.metronomeButton.click();
    });
    this.schedulable = this.buildSchedulable();
    metronomeManager.getScheduler().register(this.schedulable);
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
    metronomeManager.getScheduler().deregister(this.schedulable);
  };

  buildSchedulable() {
    return {
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
  }
}

export default new Component(COMPONENT_NAME, Metronome);
