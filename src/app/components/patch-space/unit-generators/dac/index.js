import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Dac from 'services/audio/dac';
import Visualizer from 'services/audio/visualizer';
import metronomeManager from 'services/metronome/metronomeManager';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
import style from './patch-dac.css';
import markup from './patch-dac.html';

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

const dom = [ 'button', 'fftVisualizer' ];

class PatchDac extends BaseComponent {
  constructor() {
    super(style, markup, dom);
    this.dac = new Dac();
    this.visualizer = new Visualizer();
    this.audioModel = new PatchAudioModel('DAC', this.dac, PATCH_EVENT.SIGNAL, PATCH_EVENT.EMPTY);
    this.stateManager = getStateManager();
  }

  connectedCallback() {
    this.metronomeSchedulable = new MetronomeScheduler({
      render: this.render.bind(this),
      stop: () => this.dom.fftVisualizer.clear()
    });
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
}

export default new Component('patch-dac', PatchDac);
