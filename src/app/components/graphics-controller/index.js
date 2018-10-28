import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import {getGraphicsStates} from 'components/graphics/graphics-root/modules/graphicsManager';
import graphicsChannel from 'services/BroadcastChannel';
import visualizer from 'services/audio/visualizer';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'graphics-controller';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class GraphicsController extends BaseComponent {
  constructor() {
    super(style, markup);
  }

  connectedCallback() {
    this.metronomeSchedulable = this.buildMetronomeSchedulable();
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
    this.selectBox = this.shadowRoot.getElementById('optionsContainer');
    this.selectBox.addEventListener('change', event => {
      const value = this.selectBox.value;
      graphicsChannel.postMessage({ type: 'GRAPHICS_MODE', value });
    });
    getGraphicsStates()
      .map(graphicsState => {
        const option = document.createElement('option');
        option.value = graphicsState.value;
        option.innerText = graphicsState.label;
        return option;
      })
      .forEach(element => this.selectBox.appendChild(element));
  }

  render() {
    // const freqDataArray = visualizer.getCachedFrequencyData();
    // graphicsChannel.postMessage({ type: 'FFT', value: freqDataArray });
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

export default new Component(COMPONENT_NAME, GraphicsController);
