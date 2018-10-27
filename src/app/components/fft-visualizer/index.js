import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus, tickEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';
import visualizer from 'services/audio/visualizer';

const COMPONENT_NAME = 'fft-visualizer';
const markup = '<canvas id="canvas"></canvas>';

const WIDTH = 100;
const HEIGHT = 50;
const MAX_BYTE = Math.pow(2, 8) - 1;
const ACTIVE_CLASS = 'visualizer--active';
const domMap = { canvas: 'canvas' };

function getGraphicsContext(canvasElement, width, height) {
  const g2d = canvasElement.getContext('2d');
  canvasElement.width = width;
  canvasElement.height = height;
  g2d.clearRect(0, 0, WIDTH, HEIGHT);
  g2d.strokeStyle = '#FFFFFFBB';
  g2d.fillStyle = '#FFFFFFBB';
  g2d.lineWidth = 2;
  g2d.translate(0, height);
  g2d.scale(1, -1);
  return g2d;
}

class FftVisualizer extends BaseComponent {
  constructor() {
    super('', markup, domMap);
  }

  connectedCallback() {
    this.g2d = getGraphicsContext(this.dom.canvas, WIDTH, HEIGHT);
  }

  fadeCanvas() {
    this.g2d.fillStyle = '#33333360';
    this.g2d.fillRect(0, 0, WIDTH, HEIGHT);
    this.g2d.fillStyle = '#FFFFFF99';
  }

  renderTimeData(timeData) {
    const bufferLength = timeData.length;
    const step = WIDTH / bufferLength;
    this.fadeCanvas();
    this.g2d.beginPath();
    timeData.forEach((value, index) => {
      const normalValue = (value / MAX_BYTE) * HEIGHT;
      const x = step * index;
      const y = (MAX_BYTE / HEIGHT) + normalValue;
      index === 0 ? this.g2d.moveTo(x, y) : this.g2d.lineTo(x, y);
    });
    this.g2d.stroke();
  }

  // TODO: copy domain tranform from `onCutoffUpdate`
  renderFrequencyData(frequencyData) {
    const bufferLength = frequencyData.length;
    const step = WIDTH / bufferLength;
    this.fadeCanvas();
    frequencyData.forEach((value, index) => {
      const x = step * index;
      const height = (value / MAX_BYTE) * HEIGHT;
      this.g2d.fillRect(x, 0, step, height);
    });
  }
}

export default new Component(COMPONENT_NAME, FftVisualizer);
