import BaseComponent from 'common/util/base-component';
import Visualizer from 'services/audio/visualizer';
import metronomeManager from 'services/metronome/metronomeManager';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';
import audioGraph from 'services/audio/Graph';
import style from './sound-visualizer.css';
import markup from './sound-visualizer.html';

const STATE = {
  OFF: 'OFF',
  TIME: 'TIME',
  FREQUENCY: 'FREQUENCY',
  SPECTROGRAM: 'SPECTROGRAM'
};

function getStateManager(fftVisualizer, visualizer) {
  const renderMethod = {
    [STATE.TIME]: () => fftVisualizer.renderTimeData(visualizer.getTimeData()),
    [STATE.FREQUENCY]: () => fftVisualizer.renderFrequencyData(visualizer.getFrequencyData()),
    [STATE.SPECTROGRAM]: () => fftVisualizer.renderSpectrogram(visualizer.getFrequencyData())
  };
  const keys = Object.keys(STATE);
  let index = 0;
  return {
    incrementState: () => {
      index = (index + 1) % keys.length;
      return keys[index];
    },
    isOff: () => keys[index] === STATE.OFF,
    renderStrategy: () => renderMethod[keys[index]],
  };
}

export default class SoundVisualizer extends BaseComponent {
  static get tag() {
    return 'sound-visualizer';
  }

  constructor() {
    super(style, markup, [ 'button', 'fftVisualizer' ]);
    this.visualizer = new Visualizer();
    this.stateManager = getStateManager(this.dom.fftVisualizer, this.visualizer);
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
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  toggle() {
    this.stateManager.incrementState();
    if (this.stateManager.isOff()) {
      this.dom.button.classList.add('visible');
      this.dom.fftVisualizer.classList.remove('visible');
      this.visualizer.disconnect(audioGraph.getOutput());
    } else {
      this.dom.button.classList.remove('visible');
      this.dom.fftVisualizer.classList.add('visible');
      this.visualizer.connect(audioGraph.getOutput());
    }
  }

  render() {
    if (this.stateManager.isOff()) { return; }
    this.stateManager.renderStrategy()();
  }
}
