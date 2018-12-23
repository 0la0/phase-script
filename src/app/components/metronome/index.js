import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import metronomeManager from 'services/metronome/metronomeManager';
import style from './metronome-ctrl.css';
import markup from './metronome-ctrl.html';

class Metronome extends BaseComponent {
  constructor() {
    super(style, markup, ['metronomeButton']);
    this.isRunning = false;
    this.titleIndex = 0;
  }

  connectedCallback() {
    this.titleElement = document.getElementsByTagName('title')[0];
    window.addEventListener('keydown', event => {
      if (event.code !== 'Space') { return; }
      event.preventDefault();
      event.stopPropagation();
      this.dom.metronomeButton.click();
    });
  }

  onMetronomeClick() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      metronomeManager.getMetronome().start();
      this.titleElement.innerText = 'Audio Running';
    }
    else {
      metronomeManager.getMetronome().stop();
      this.titleElement.innerText = 'Audio Stopped';
    }
  }

  handleMetronomeChange(event) {
    const value = parseInt(event.target.value, 10);
    metronomeManager.getMetronome().setTempo(value);
  }
}

export default new Component('metronome-ctrl', Metronome);
