import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { getSampleKeys, getAudioBuffer } from 'services/audio/sampleBank';
import { play, playTemp } from 'services/audio/sampler';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
// TODO: remove
import { audioEventBus } from 'services/EventBus';

const COMPONENT_NAME = 'simple-sampler';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  sampleSelect: 'sampleSelect',
  samplerLabel: 'samplerLabel',
  sampleVisualizer: 'sampleVisualizer',
  adsrEnvelope: 'adsrEnvelope',
};

let instanceCnt = 0;

class Sampler extends BaseComponent {

  constructor() {
    super(style, markup, domMap);
    this.sampleKey;
    this.asr = {
      attack: 0.01,
      sustain: 0.1,
      release: 0.01
    };
    this.startOffset = 0;
    this.eventModel = new PatchEventModel(this._schedule.bind(this));
    this.audioModel = new PatchAudioModel('SAMPLER', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
  }

  connectedCallback() {
    const samples = getSampleKeys().map(sampleName => ({ label: sampleName, value: sampleName }));
    this.audioEventSubscription = {
      address: `SAMPLE_${instanceCnt++}`,
      onNext: message => {
        play(this.sampleKey, message.time.audio, this.startOffset, this.asr);
      }
    };
    audioEventBus.subscribe(this.audioEventSubscription);
    setTimeout(() => {
      this.dom.sampleSelect.setOptions(samples);
      this.dom.sampleVisualizer.setStartOffsetCallback(startOffset => this.startOffset = startOffset);
      this.dom.adsrEnvelope.setChangeCallback((param, value) => {
        this.asr[param] = value;
        this.dom.sampleVisualizer.setAsr(this.asr);
      });
    });
  }

  disconnectedCallback() {
    audioEventBus.unsubscribe(this.audioEventSubscription);
  }

  onSampleChange(value) {
    const audioBuffer = getAudioBuffer(value);
    const bufferLength = (audioBuffer.duration * 1000).toFixed(2);
    this.sampleKey = value;
    this.dom.samplerLabel.innerText = `Sample: ${value}, ${bufferLength}ms`;
    this.dom.sampleVisualizer.setAudioBuffer(audioBuffer, this.asr);
  }

  onPlayerClick() {
    play(this.sampleKey, 0, this.startOffset, this.asr);
  }

  _schedule(message) {
    const outputs = [...this.eventModel.getOutlets()];
    const note = message.note !== undefined ? message.note : 60;
    playTemp(this.sampleKey, message.time.audio, this.startOffset, note, this.asr, outputs);
  }

  schedule(onTime) {
    play(this.sampleKey, onTime, this.startOffset, this.asr);
  }
}

export default new Component(COMPONENT_NAME, Sampler);
