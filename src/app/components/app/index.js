import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import 'components/_util/componentManager.js';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'app-entry';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();

class App extends BaseComponent {

  constructor() {
    super(style, markup);
  }

}

export default new Component(COMPONENT_NAME, App);
