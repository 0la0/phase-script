import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'sample-visualizer';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

// TODO: make size dynamic
const WIDTH = 120;
const HEIGHT = 40;
const HALF_HEIGHT = HEIGHT / 2;
const RENDER_MAGNITUDE = 15;

function getWaveform(audioBuffer, canvasWidth) {
  const peaks = [];
  const stepSize = Math.floor(audioBuffer.length / canvasWidth);
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel = audioBuffer.getChannelData(
    audioBuffer.numberOfChannels > 1 ? 1 : 0
  );
  for (let i = 0; i < leftChannel.length; i += stepSize) {
    const left = leftChannel[i];
    const right = rightChannel[i];
    peaks.push({ left, right });
  }
  return Promise.resolve(peaks);
}

class SampleVisualizer extends BaseComponent {
  constructor() {
    super(style, markup);
    this.audioBuffer = { duration: 0 };
    this.asr = {
      attack: 0,
      sustain: 0,
      release: 0
    };
    this.mouseIsDown = false;
    this.bufferDuration = 0;
    this.startOffset = 0;
    this.startOffsetCallback = () => {};
  }

  connectedCallback() {
    this.canvas = this.root.getElementById('canvas');
    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;
    this.g2d = this.canvas.getContext('2d');
    this.g2d.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    this.g2d.fillStyle = 'rgba(0, 0, 0, 0.4)';

    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', () => this.mouseIsDown = false);
    this.canvas.addEventListener('mouseout', () => this.mouseIsDown = false);
  }

  onMouseDown(event) {
    this.mouseIsDown = true;
    this.setStart(event.clientX);
  }

  onMouseMove(event) {
    if (!this.mouseIsDown) { return; }
    this.setStart(event.clientX);
  }

  setStart(clientX) {
    const boundingBox = this.canvas.getBoundingClientRect();
    const percentX = (clientX - boundingBox.left) / boundingBox.width;
    const startOffset = percentX * this.bufferDuration;
    this.startOffset = percentX;
    this.startOffsetCallback(startOffset);
    this.render();
  }

  setStartOffsetCallback(cb) {
    this.startOffsetCallback = cb;
  }

  setAudioBuffer(audioBuffer, asr) {
    this.audioBuffer = audioBuffer;
    this.bufferDuration = audioBuffer.duration;
    this.asr = asr;
    getWaveform(audioBuffer, WIDTH)
      .then(frequencyList => this.frequencyList = frequencyList)
      .then(() => this.render())
      .catch(error => console.log(error));
  }

  setAsr(asr) {
    this.asr = asr;
    if (!this.frequencyList) {
      return;
    }
    this.render();
  }

  render() {
    const playbackStart = (this.startOffset || 0) * WIDTH;
    const secondMultiplier = (1 / this.audioBuffer.duration) * WIDTH;
    const sustainStart = playbackStart + secondMultiplier * this.asr.attack;
    const decayStart = sustainStart + secondMultiplier * this.asr.sustain
    const decayEnd = decayStart + secondMultiplier * this.asr.release;

    //--- DRAW WAVEFORM ---//
    this.g2d.clearRect(0, 0, WIDTH, HEIGHT);
    this.g2d.beginPath();
    this.frequencyList.forEach((value, index) => {
      const y = value.left * RENDER_MAGNITUDE + HALF_HEIGHT;
      index === 0 ? this.g2d.moveTo(0, y) : this.g2d.lineTo(index, y);
    });
    this.g2d.stroke();
    this.g2d.beginPath();
    this.frequencyList.forEach((value, index) => {
      const y = value.right * RENDER_MAGNITUDE + HALF_HEIGHT;
      index === 0 ? this.g2d.moveTo(0, y) : this.g2d.lineTo(index, y);
    });
    this.g2d.stroke();

    //--- FILL PRE-ATTACK REGION---//
    this.g2d.beginPath();
    this.g2d.moveTo(0, 0);
    this.g2d.lineTo(0, HEIGHT);
    this.g2d.lineTo(playbackStart, HEIGHT);
    this.g2d.lineTo(sustainStart, 0);
    this.g2d.fill();

    //--- FILL POST-SUSTAIN REGION---//
    this.g2d.beginPath();
    this.g2d.moveTo(decayStart, 0);
    this.g2d.lineTo(decayEnd, HEIGHT);
    this.g2d.lineTo(WIDTH, HEIGHT);
    this.g2d.lineTo(WIDTH, 0);
    this.g2d.fill();
  }
}

export default new Component(COMPONENT_NAME, SampleVisualizer);
