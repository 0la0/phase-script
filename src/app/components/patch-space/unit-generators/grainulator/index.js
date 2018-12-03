import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { getPosNeg } from 'services/Math';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchParam, { PatchParamModel } from 'components/patch-param';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import ParamScheduler from 'components/patch-space/modules/ParamScheduler';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'patch-grainulator';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const DEFAULT_VALUES = {
  GRAIN_DENSITY: 0.2,
  NUM_VOICES: 0.05,
  TIME_SCATTER: 0.2,
};

function getGrainsPerTick(grainDensity) {
  const MAX_GRAINS = 20;
  return Math.round(MAX_GRAINS * grainDensity);
}

class PatchGrainulator extends BaseComponent {
  constructor() {
    super(style, markup);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('GRAIN', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.params = {
      grainDensity: DEFAULT_VALUES.GRAIN_DENSITY,
      timeScatter: DEFAULT_VALUES.TIME_SCATTER,
    };
    this.paramScheduler = {
      grainDensity: new ParamScheduler(message => message.note / 127),
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
    const timeScatterParam = new PatchParam.element(new PatchParamModel({
      label: 'TimeJit',
      defaultValue: DEFAULT_VALUES.TIME_SCATTER,
      setValue: val => this.params.timeScatter = val,
      setValueFromMessage: message => this.paramScheduler.timeScatter.schedule(message),
      showValue: true,
    }));
    this.shadowRoot.appendChild(grainDensityParam);
    this.shadowRoot.appendChild(timeScatterParam);
  }

  schedule(message) {
    setTimeout(() => {
      const { grainDensity, timeScatter } = this.getParametersForTime(message.time.audio);
      const tickLength = metronomeManager.getMetronome().getTickLength();
      const grainsPerTick = getGrainsPerTick(grainDensity);
      const grainFrequency = tickLength / grainsPerTick;
      for (let i = 0; i < grainsPerTick; i++) {
        const timeJitter = getPosNeg() * tickLength * 2 * timeScatter * Math.random();
        const grainOffset = i * grainFrequency + timeJitter;
        const grainMessage = message.clone();
        grainMessage.time.add(grainOffset);
        this.eventModel.getOutlets().forEach(outlet => outlet.schedule(grainMessage));
      }
    });
  }

  getParametersForTime(time) {
    return {
      grainDensity: this.paramScheduler.grainDensity.getValueForTime(time) || this.params.grainDensity,
      timeScatter: this.paramScheduler.timeScatter.getValueForTime(time) || this.params.timeScatter,
    };
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchGrainulator);
