import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Dac from 'services/audio/dac';
import Visualizer from 'services/audio/visualizer';
import metronomeManager from 'services/metronome/metronomeManager';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';

const COMPONENT_NAME = 'patch-dac';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const STATE = {
  OFF: 'OFF',
  TIME: 'TIME',
  FREQUENCY: 'FREQUENCY'
};

function getStateManager() {
  let index = 0;
  return {
    incrementState: () => {
      index = (index + 1) % Object.keys(STATE).length;
      return Object.keys(STATE)[index];
    },
    isOff: () => Object.keys(STATE)[index] === STATE.OFF,
    isFrequencyDomain: () => Object.keys(STATE)[index] === STATE.FREQUENCY,
    isTimeDomain: () => Object.keys(STATE)[index] === STATE.TIME,
  };
}

const domMap = {
  button: 'button',
  fftVisualizer: 'fftVisualizer'
};

class PatchDac extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.dac = new Dac();
    this.visualizer = new Visualizer();
    this.audioModel = new PatchAudioModel('DAC', this.dac, PATCH_EVENT.SIGNAL, PATCH_EVENT.EMPTY);
    this.stateManager = getStateManager();
  }

  connectedCallback() {
    this.metronomeSchedulable = this.buildMetronomeSchedulable();
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
    this.dom.fftVisualizer.addEventListener('click', this.toggle.bind(this));
  }

  disconnectedCallback() {
    this.dac.disconnect();
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  toggle() {
    this.stateManager.incrementState();
    if (this.stateManager.isOff()) {
      this.dom.button.classList.add('visible');
      this.dom.fftVisualizer.classList.remove('visible');
      this.visualizer.disconnect(this.dac.getInput());
    } else {
      this.dom.button.classList.remove('visible');
      this.dom.fftVisualizer.classList.add('visible');
      this.visualizer.connect(this.dac.getInput());
    }
    this.onRender();
  }

  render() {
    if (this.stateManager.isOff()) { return; }
    if (this.stateManager.isTimeDomain()) {
      this.dom.fftVisualizer.renderTimeData(this.visualizer.getTimeData());
    } else {
      this.dom.fftVisualizer.renderFrequencyData(this.visualizer.getFrequencyData());
    }
  }

  buildMetronomeSchedulable() {
    return {
      processTick: (tickNumber, time) => {},
      render: (tickNumber, lastTickNumber) => this.render(),
      start: () => {},
      stop: () => {}
    };
  }
}

export default new Component(COMPONENT_NAME, PatchDac);
