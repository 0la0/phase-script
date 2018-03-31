import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus, tickEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';
import visualizer from 'services/audio/visualizer';

const COMPONENT_NAME = 'fft-visualizer';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const WIDTH = 200;
const HEIGHT = 100;
const MAX_BYTE = Math.pow(2, 8) - 1;
const ACTIVE_CLASS = 'visualizer--active';

function getGraphicsContext (canvasElement, width, height) {
  const g2d = canvasElement.getContext('2d');
  canvasElement.width = width;
  canvasElement.height = height;
  g2d.strokeStyle = 'black';
  g2d.lineWidth = 2;
  g2d.fillStyle = 'black';
  g2d.translate(0, height);
  g2d.scale(1, -1);
  return g2d;
}

class FftVisualizer extends BaseComponent {

  constructor() {
    super(style, markup);
  }

  connectedCallback() {
    this.isOn = false;
    this.metronomeSchedulable = this.buildMetronomeSchedulable();
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
    this.visualizerParent = this.root.getElementById('visualizerParent');
    const timeDomainCanvas = this.root.getElementById('timeDomainCanvas');
    const frequencyDomainCanvas = this.root.getElementById('frequencyDomainCanvas');
    this.timeVisualizer = getGraphicsContext(timeDomainCanvas, WIDTH, WIDTH);
    this.frequencyVisualizer = getGraphicsContext(frequencyDomainCanvas, WIDTH, WIDTH);
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
    this.isOn = false;
    // TODO: CLEANUP
  }

  onToggle(event) {
    console.log(this.visualizerParent)
    this.isOn = !this.isOn;
    this.isOn ?
      this.visualizerParent.classList.add(ACTIVE_CLASS) :
      this.visualizerParent.classList.remove(ACTIVE_CLASS);
  }

  render() {
    // console.log('render')

    const timeData = visualizer.getTimeData();
    const freqData = visualizer.getFrequencyData();
    const bufferLength = visualizer.getBufferLength();
    const step = WIDTH / bufferLength;

    // const freqHasNonZeroVal = freqData.some(val => val !== 0);
    // const timeHasNonZeroVal = timeData.some(val => val !== 128);
    // console.log('hasNonZeroVal', freqHasNonZeroVal, timeHasNonZeroVal);
    // return;
    //let hzPerBin = this.model.getHzPerBin();

    this.timeVisualizer.clearRect(0, 0, WIDTH, HEIGHT);
    this.timeVisualizer.beginPath();
    timeData.forEach((value, index) => {
      const normalValue = (value / MAX_BYTE) * 100;
      const x = step * index;
      const y = (MAX_BYTE / HEIGHT) + normalValue;
      index === 0 ?
        this.timeVisualizer.moveTo(x, y) :
        this.timeVisualizer.lineTo(x, y);
    });
    this.timeVisualizer.stroke();

    this.frequencyVisualizer.clearRect(0, 0, WIDTH, HEIGHT);
    freqData.forEach((value, index) => {
      const x = step * index;
      const height = (value / MAX_BYTE) * HEIGHT;
      this.frequencyVisualizer.fillRect(x, 0, step, height);
    });
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

export default new Component(COMPONENT_NAME, FftVisualizer);
