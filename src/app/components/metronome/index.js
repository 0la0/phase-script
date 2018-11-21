import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
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
  }

  onMetronomeClick() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      metronome.start();
      this.titleElement.innerText = 'Audio Running';
    }
    else {
      metronome.stop();
      this.titleElement.innerText = 'Audio Stopped';
    }
  }
}

export default new Component(COMPONENT_NAME, Metronome);
