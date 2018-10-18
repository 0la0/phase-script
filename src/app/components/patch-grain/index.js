import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchParam, { PatchParamModel } from 'components/patch-param';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import ParamScheduler from 'components/patch-space/modules/ParamScheduler';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'patch-grain';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

// class GrainInstrument {
//   constructor() {
//     this.position = 0.5;
//     this.spread = 0.1;
//     this.loopDuration = 0.01;
//     this.timeScatter = 0;
//     this.numVoices = 0;
//     this.grainsPerTick = 0;
//   }
// }

const DEFAULT_VALUES = {
  GRAIN_DENSITY: 0.2,
  NUM_VOICES: 1,
  TIME_SCATTER: 0.2,
};

function calculateNumVoices(normalValue) {
  return 1 + Math.round(9 * normalValue);
}

function getGrainsPerTick(grainDensity) {
  const MAX_GRAINS = 20;
  return Math.round(MAX_GRAINS * grainDensity);
}

// TODO: External Params
// position spread

class PatchGrain extends BaseComponent {
  constructor() {
    super(style, markup, {});
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('GRAIN', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.params = {
      grainDensity: DEFAULT_VALUES.GRAIN_DENSITY,
      numVoices: DEFAULT_VALUES.NUM_VOICES,
      timeScatter: DEFAULT_VALUES.TIME_SCATTER,
    };
    this.paramScheduler = {
      grainDensity: new ParamScheduler(message => message.note / 127),
      numVoices: new ParamScheduler(message => calculateNumVoices(message.note / 127)),
      timeScatter: new ParamScheduler(message => message.note / 127),
    };
  }

  connectedCallback() {
    const grainDensityParam = new PatchParam.element(new PatchParamModel({
      label: 'Density',
      defaultValue: DEFAULT_VALUES.GRAIN_DENSITY,
      setValue: val => this.params.grainDensity = val,
      setValueFromMessage: message => this.paramScheduler.grainDensity.schedule(message),
      showValue: true,
    }));
    const numVoicesParam = new PatchParam.element(new PatchParamModel({
      label: 'Voices',
      defaultValue: DEFAULT_VALUES.NUM_VOICES,
      setValue: val => this.params.numVoices = calculateNumVoices(val),
      setValueFromMessage: message => this.paramScheduler.numVoices.schedule(message),
      showValue: true,
    }));
    const timeScatterParam = new PatchParam.element(new PatchParamModel({
      label: 'TimeJit',
      defaultValue: DEFAULT_VALUES.TIME_SCATTER,
      setValue: val => this.params.timeScatter = val,
      setValueFromMessage: message => this.paramScheduler.timeScatter.schedule(message),
      showValue: true,
    }));
    this.root.appendChild(grainDensityParam);
    this.root.appendChild(numVoicesParam);
    this.root.appendChild(timeScatterParam);
  }

  schedule(message) {
    setTimeout(() => {
      const { grainDensity, numVoices, timeScatter } = this.getParametersForTime(message.time.audio);
      const note = message.note !== undefined ? message.note : 60;
      const tempo = metronomeManager.getMetronome().getTempo();
      const tickLength = metronomeManager.getMetronome().getTickLength();
      const baseTime = message.time.audio;
      const grainsPerTick = getGrainsPerTick(grainDensity);
      const grainFrequency = tickLength / grainsPerTick;
      const grainSchedules = [];
      for (let i = 0; i < grainsPerTick; i++) {
        const time = baseTime + i * grainFrequency;
        grainSchedules.push({ time, });
      }
      console.log(baseTime, grainSchedules)
      console.log('GrainSchedule:', grainDensity, numVoices, timeScatter)
      console.log('eventModel outlets', this.eventModel.getOutlets())
    });
  }

  getParametersForTime(time) {
    return {
      grainDensity: this.paramScheduler.grainDensity.getValueForTime(time) || this.params.grainDensity,
      numVoices: this.paramScheduler.numVoices.getValueForTime(time) || this.params.numVoices,
      timeScatter: this.paramScheduler.timeScatter.getValueForTime(time) || this.params.timeScatter,
    };
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchGrain);
