import BaseComponent from 'components/_util/base-component';
import { mapToRange } from 'services/Math';

const style = `
  canvas {
    margin: 0;
    padding: 0;
    border-radius: var(--border-radius);
  }
`;

const WIDTH = 2 ** 7;
const HEIGHT = 50;
const STROKE_ADJUST = 4;
const MAX_BYTE = (2 ** 8) - 1;

function getGraphicsContext(canvasElement, width, height) {
  const g2d = canvasElement.getContext('2d');
  canvasElement.width = width;
  canvasElement.height = height;
  g2d.width = width;
  g2d.height = height;
  g2d.clearRect(0, 0, WIDTH, HEIGHT);
  g2d.strokeStyle = '#FFFFFFBB';
  g2d.fillStyle = '#FFFFFFBB';
  g2d.lineWidth = STROKE_ADJUST / 2;
  return g2d;
}

export default class FftVisualizer extends BaseComponent {
  static get tag() {
    return 'fft-visualizer';
  }

  constructor() {
    super(style, '<canvas id="canvas"></canvas>', [ 'canvas' ]);
    this.g2d = getGraphicsContext(this.dom.canvas, WIDTH, HEIGHT);
  }

  clear() {
    this.g2d.clearRect(0, 0, WIDTH, HEIGHT);
  }

  fadeCanvas() {
    this.g2d.fillStyle = '#24242460';
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
      const y = ( (MAX_BYTE / HEIGHT) + normalValue ) - STROKE_ADJUST;
      index === 0 ? this.g2d.moveTo(x, y) : this.g2d.lineTo(x, y);
    });
    this.g2d.stroke();
  }

  renderFrequencyData(frequencyData) {
    this.fadeCanvas();
    for (let i = 0; i < WIDTH; i++) {
      const height = (frequencyData[i] / MAX_BYTE) * HEIGHT;
      this.g2d.fillRect(i, HEIGHT - height, 1, height);
    }
  }

  renderSpectrogram(frequencyData) {
    this.g2d.drawImage(this.dom.canvas, 0, 0, WIDTH, HEIGHT, 0, -STROKE_ADJUST, WIDTH, HEIGHT);
    for (let i = 0; i < WIDTH; i++) {
      const val = mapToRange(0, MAX_BYTE, 36, MAX_BYTE, frequencyData[i]);
      this.g2d.fillStyle = `rgb(${val}, ${val}, ${val})`;
      this.g2d.fillRect(i, HEIGHT - STROKE_ADJUST, 1, STROKE_ADJUST);
    }
  }
}
