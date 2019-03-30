import BaseComponent from 'common/util/base-component';
import metronomeManager from 'services/metronome/metronomeManager';
import style from './metronome-ctrl.css';
import markup from './metronome-ctrl.html';

export default class Metronome extends BaseComponent {
  static get tag() {
    return 'metronome-ctrl';
  }

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
