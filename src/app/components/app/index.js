import BaseComponent from '../_util/base-component';
import Component from '../_util/component';
import '../_util/componentManager.js';
import metronomeManager from '../../metronome/metronomeManager';


const COMPONENT_NAME = 'app-entry';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();

class App extends BaseComponent {

  constructor() {
    super(style, markup);
    this.isRunning = false;
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

}

export default new Component(COMPONENT_NAME, App);
