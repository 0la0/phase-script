import BaseComponent from 'common/util/base-component';
import sampleBank from 'services/audio/sampleBank';
import markup from './sample-visualizer.html';
import style from './sample-visualizer.css';

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

export default class SampleVisualizer extends BaseComponent {
  static get tag() {
    return 'sample-visualizer';
  }

  constructor(sampleKey, asr) {
    super(style, markup, ['canvas', 'sampleLength', 'sampleStart', 'sampleDuration']);
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

    this.sampleKey = sampleKey;
    this.audioBuffer = sampleBank.getAudioBuffer(sampleKey);
    this.bufferDuration = this.audioBuffer.duration;
    this.asr = asr;
    getWaveform(this.audioBuffer, WIDTH)
      .then(frequencyList => this.frequencyList = frequencyList)
      .then(() => this.render())
      .catch(error => { throw new Error(error); });
  }

  connectedCallback() {
    this.dom.canvas.width = WIDTH;
    this.dom.canvas.height = HEIGHT;
    this.g2d = this.dom.canvas.getContext('2d');
    this.g2d.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    this.g2d.fillStyle = 'rgba(0, 0, 0, 0.4)';

    this.dom.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.dom.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.dom.canvas.addEventListener('mouseup', () => this.mouseIsDown = false);
    this.dom.canvas.addEventListener('mouseout', () => this.mouseIsDown = false);
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
    const boundingBox = this.dom.canvas.getBoundingClientRect();
    const percentX = (clientX - boundingBox.left) / boundingBox.width;
    const startOffset = percentX * this.bufferDuration;
    this.startOffset = percentX;
    this.startOffsetCallback(startOffset);
    this.render();
  }

  setStartOffsetCallback(cb) {
    this.startOffsetCallback = cb;
  }

  _renderText() {
    const durationMs = this.bufferDuration * 1000;
    const startMs = this.startOffset * durationMs;
    this.dom.sampleLength.innerText = `Length: ${durationMs.toFixed(3)}ms`;
    this.dom.sampleStart.innerText = `Start: ${startMs.toFixed(3)}ms`;
  }

  _renderWaveform() {
    this.g2d.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    this.g2d.lineWidth = 2;
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
  }

  _renderEnvelope(playbackStart, sustainStart, decayStart, decayEnd) {
    this.g2d.fillStyle = 'rgba(0, 0, 0, 0.4)';
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

  _renderControls(playbackStart, sustainStart, decayStart, decayEnd) {
    this.g2d.strokeStyle = 'red';
    this.g2d.lineWidth = 2;
    this.g2d.beginPath();
    this.g2d.moveTo(playbackStart, 0);
    this.g2d.lineTo(playbackStart, HEIGHT);
    this.g2d.stroke();

    this.g2d.beginPath();
    this.g2d.moveTo(decayEnd, 0);
    this.g2d.lineTo(decayEnd, HEIGHT);
    this.g2d.stroke();
  }

  render() {
    const realPlaybackStart = (this.startOffset || 0) * WIDTH;
    const playbackStart = Math.max(0, realPlaybackStart);
    const secondMultiplier = (1 / this.audioBuffer.duration) * WIDTH;
    const sustainStart = playbackStart + secondMultiplier * this.asr.attack;
    const decayStart = sustainStart + secondMultiplier * this.asr.sustain;
    const realDecayEnd = decayStart + secondMultiplier * this.asr.release;
    const decayEnd = Math.min(realDecayEnd, WIDTH);
    this.g2d.clearRect(0, 0, WIDTH, HEIGHT);
    this._renderWaveform();
    this._renderEnvelope(playbackStart, sustainStart, decayStart, decayEnd);
    this._renderControls(playbackStart, sustainStart, decayStart, decayEnd);
    this._renderText(playbackStart, sustainStart, decayStart, decayEnd);
  }
}
