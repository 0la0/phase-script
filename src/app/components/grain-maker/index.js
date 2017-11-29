import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import audioEventBus from 'services/AudioEventBus';
// import sampler from 'services/audio/sampler';
import { getSampleKeys } from 'services/audio/sampleBank';

const COMPONENT_NAME = 'grain-maker';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

// positionOutput
// spreadOutput
// loopDurationOutput
// timeScatterOutput
// numVoicesOutput

// To publish:
// address: "SAMPLER"
// note: "click"
// scheduledTime: {audio: 12.123514739229025, midi: 12680.085000000001}
// time: 12.123514739229025
// timeOption: "audio"

const PARAMS = {
  position: 'position',
  spread: 'spread',
  loopDuration: 'loopDuration',
  timeScatter: 'timeScatter',
  numVoices: 'numVoices'
};

class GrainInstrument {

  constructor() {
    this.position = 0.5;
    this.spread = 0.1;
    this.loopDuration = 0.01;
    this.timeScatter = 0;
    this.numVoices = 0;
  }

}

class GrainMaker extends BaseComponent {

  constructor() {
    super(style, markup);
    this.grainInstrument = new GrainInstrument();
  }

  connectedCallback() {
    audioEventBus.subscribe({
      address: 'GRAIN-MAKER',
      onNext: message => {
        console.log('grain message', message);
      }
    });

    this.output = Object.keys(PARAMS).reduce((output, param) => {
      const element = this.root.getElementById(`${param}Output`);
      return Object.assign(output, { [param]: element });
    }, {});

    this.sliders = Object.keys(PARAMS).reduce((output, param) => {
      const element = this.root.getElementById(`${param}-slider`);
      element.setValue(this.grainInstrument[param], true);
      return Object.assign(output, { [param]: element });
    }, {});

  }

  onPositionUpdate(value) {
    this.grainInstrument.position = value;
    this.output.position.innerText = value.toFixed(2);
  }

  onSpreadUpdate(value) {
    this.grainInstrument.spread = value;
    this.output.spread.innerText = value.toFixed(2);
  }

  onLoopDurationUpdate(value) {
    this.grainInstrument.loopDuration = value;
    this.output.loopDuration.innerText = value.toFixed(2);
  }

  onTimeScatterUpdate(value) {
    this.grainInstrument.timeScatter = value;
    this.output.timeScatter.innerText = value.toFixed(2);
  }

  onNumVoicesUpdate(value) {
    const discreetValue = Math.floor(value * 5) + 1;
    this.grainInstrument.numVoices = discreetValue;
    this.output.numVoices.innerText = discreetValue;
  }

}

export default new Component(COMPONENT_NAME, GrainMaker);
