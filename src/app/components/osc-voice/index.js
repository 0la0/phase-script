import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Osc, { OSCILATORS } from 'services/audio/synth/Osc';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import PatchParam, { PatchParamModel } from 'components/patch-param';
import ParamScheduler from 'components/patch-space/modules/ParamScheduler';

const COMPONENT_NAME = 'osc-voice';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  gainOutput: 'gainOutput',
  oscTypeComboBox: 'oscTypeComboBox',
  gainSlider: 'gainSlider',
  frequencyInlet: 'frequencyInlet',
};
const GAIN_VALUE = 1;

class OscVoice extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.oscType = OSCILATORS.SINE;
    this.asr = {
      attack: 0.01,
      sustain: 0.1,
      release: 0.01,
    };
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('OSC', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
    this.paramScheduler = {
      attack: new ParamScheduler(message => message.note / 127),
      sustain: new ParamScheduler(message => message.note / 127),
      release: new ParamScheduler(message => message.note / 127),
    };
  }

  connectedCallback() {
    const attackParam = new PatchParam.element(new PatchParamModel({
      label: 'A',
      defaultValue: 0.01,
      setValue: val => this.asr.attack = val,
      setValueFromMessage: message => this.paramScheduler.attack.schedule(message),
      showValue: true,
    }));
    const sustainParam = new PatchParam.element(new PatchParamModel({
      label: 'S',
      defaultValue: 0.1,
      setValue: val => this.asr.sustain = val,
      setValueFromMessage: message => this.paramScheduler.sustain.schedule(message),
      showValue: true,
    }));
    const releaseParam = new PatchParam.element(new PatchParamModel({
      label: 'R',
      defaultValue: 0.01,
      setValue: val => this.asr.release = val,
      setValueFromMessage: message => this.paramScheduler.release.schedule(message),
      showValue: true,
    }));
    this.root.appendChild(attackParam);
    this.root.appendChild(sustainParam);
    this.root.appendChild(releaseParam);
  }

  schedule(message) {
    // this is problematic because it could miss a schedule
    // TODO: schedule all message parameters before scheduling ugens
    setTimeout(() => {
      const params = this.getParametersForTime(message.time.audio);
      const note = message.note !== undefined ? message.note : 60;
      const osc = new Osc(this.oscType);
      const outputs = [...this.eventModel.getOutlets()]
      osc.playNote(note, message.time.audio, params, GAIN_VALUE, outputs);
    });
  }

  getOsc() {
    return this.osc;
  }

  onOscTypeChange(value) {
    this.oscType = value
  }

  getParametersForTime(time) {
    return {
      attack: this.paramScheduler.attack.getValueForTime(time) || this.asr.attack,
      sustain: this.paramScheduler.sustain.getValueForTime(time) || this.asr.sustain,
      release: this.paramScheduler.release.getValueForTime(time) || this.asr.release,
    };
  }

  // TODO: move inlet properties into a PatchParam
  getInletCenter() {
    const boundingBox = this.dom.frequencyInlet.getBoundingClientRect();
    return {
      x: boundingBox.left + (boundingBox.width / 2),
      y: boundingBox.top + (boundingBox.height / 2),
    };
  }

  getFrequencyModel() {
    // Frequency modulation for osc will require a priority event manager
    // or a child to parent graph traversal
    return {
      getAudioModelInput: () => {
        console.log('osc-voice: set up connection to osc frequency');
      },
    };
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, OscVoice);
