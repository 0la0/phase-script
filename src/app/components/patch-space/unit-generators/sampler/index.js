import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { getSampleKeys, getAudioBuffer } from 'services/audio/sampleBank';
import { playSample } from 'services/audio/sampler';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import ParamScheduler from 'services/PatchSpace/ParamScheduler';
import PatchParam, { PatchParamModel } from 'components/patch-space/patch-param';

const COMPONENT_NAME = 'simple-sampler';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const dom = [ 'sampleSelect', 'samplerLabel', 'sampleVisualizer', 'paramInlet' ];

class Sampler extends BaseComponent {
  constructor() {
    super(style, markup, dom);
    this.sampleKey;
    this.params = {
      startOffset: 0,
      attack: 0.01,
      sustain: 0.1,
      release: 0.01
    };
    this.bufferDuration;
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('SAMPLER', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
    this.paramScheduler = {
      startOffset: new ParamScheduler(message => (message.note / 127) * this.bufferDuration),
      attack: new ParamScheduler(message => message.note / 127),
      sustain: new ParamScheduler(message => message.note / 127),
      release: new ParamScheduler(message => message.note / 127),
    };
  }

  connectedCallback() {
    const samples = getSampleKeys().map(sampleName => ({ label: sampleName, value: sampleName }));
    this.initParams();
    setTimeout(() => {
      this.dom.sampleSelect.setOptions(samples);
      this.dom.sampleVisualizer.setStartOffsetCallback(startOffset => this.params.startOffset = startOffset);
    });
  }

  initParams() {
    const attackParam = new PatchParam.element(new PatchParamModel({
      label: 'A',
      defaultValue: 0.01,
      setValue: this.onAttackUpdate.bind(this),
      setValueFromMessage: message => this.paramScheduler.attack.schedule(message),
      showValue: true,
    }));
    const sustainParam = new PatchParam.element(new PatchParamModel({
      label: 'S',
      defaultValue: 0.1,
      setValue: this.onSustainUpdate.bind(this),
      setValueFromMessage: message => this.paramScheduler.sustain.schedule(message),
      showValue: true,
    }));
    const releaseParam = new PatchParam.element(new PatchParamModel({
      label: 'R',
      defaultValue: 0.01,
      setValue: this.onReleaseUpdate.bind(this),
      setValueFromMessage: message => this.paramScheduler.release.schedule(message),
      showValue: true,
    }));
    this.shadowRoot.appendChild(attackParam);
    this.shadowRoot.appendChild(sustainParam);
    this.shadowRoot.appendChild(releaseParam);
  }

  // disconnectedCallback() {
  //   audioEventBus.unsubscribe(this.audioEventSubscription);
  // }

  handleSampleChange(event) {
    const sampleName = event.target.value;
    const audioBuffer = getAudioBuffer(sampleName);
    const bufferLength = (audioBuffer.duration * 1000).toFixed(2);
    this.sampleKey = sampleName;
    this.bufferDuration = audioBuffer.duration;
    this.dom.samplerLabel.innerText = `Sample: ${sampleName}, ${bufferLength}ms`;
    this.dom.sampleVisualizer.setAudioBuffer(audioBuffer, this.params);
  }

  schedule(message) {
    // this is problematic because it could miss a schedule
    // TODO: schedule all message parameters before scheduling ugens
    setTimeout(() => {
      const params = this.getParametersForTime(message.time.audio);
      const outputs = [...this.eventModel.getOutlets()];
      const note = message.note !== undefined ? message.note : 60;
      playSample(this.sampleKey, message.time.audio, params.startOffset, note, params, outputs);
    });
  }

  onAttackUpdate(value) {
    this.params.attack = value;
    this.dom.sampleVisualizer.setAsr(this.params);
  }

  onSustainUpdate(value) {
    this.params.sustain = value;
    this.dom.sampleVisualizer.setAsr(this.params);
  }

  onReleaseUpdate(value) {
    this.params.release = value;
    this.dom.sampleVisualizer.setAsr(this.params);
  }

  getParametersForTime(time) {
    return {
      startOffset: this.paramScheduler.startOffset.getValueForTime(time) || this.params.startOffset,
      attack: this.paramScheduler.attack.getValueForTime(time) || this.params.attack,
      sustain: this.paramScheduler.sustain.getValueForTime(time) || this.params.sustain,
      release: this.paramScheduler.release.getValueForTime(time) || this.params.release,
    };
  }

  // TODO: MOVE START TIME PARAM INTO a PatchParam
  getInletCenter() {
    const boundingBox = this.dom.paramInlet.getBoundingClientRect();
    return {
      x: boundingBox.left + (boundingBox.width / 2),
      y: boundingBox.top + (boundingBox.height / 2),
    };
  }

  // TODO: MOVE START TIME PARAM INTO a PatchParam
  getAudioModelInput() {
    return this.paramScheduler.startOffset;
  }
}

export default new Component(COMPONENT_NAME, Sampler);
