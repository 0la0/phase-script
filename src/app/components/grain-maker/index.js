import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { IntArray } from 'components/_util/math';
import { audioEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';
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
  numVoices: 'numVoices',
  grainsPerTick: 'grainsPerTick'
};

let instanceCnt = 0;

class GrainInstrument {

  constructor() {
    this.position = 0.5;
    this.spread = 0.1;
    this.loopDuration = 0.01;
    this.timeScatter = 0;
    this.numVoices = 0;
    this.grainsPerTick = 0;
  }

}

class GrainMaker extends BaseComponent {

  constructor() {
    super(style, markup);
  }

  connectedCallback() {
    this.schedulable = this.buildSchedulable();
    // this.scheduler = metronomeManager.getScheduler();
    this.grainInstrument = new GrainInstrument();
    this.isContinuouslyPlaying = false;

    this.audioEventSubscription = {
      address: `GRAIN-MAKER_${instanceCnt++}`,
      onNext: message => this.scheduleAudio(message)
    };
    audioEventBus.subscribe(this.audioEventSubscription);

    this.output = Object.keys(PARAMS).reduce((output, param) => {
      const element = this.root.getElementById(`${param}Output`);
      return Object.assign(output, { [param]: element });
    }, {});

    setTimeout(() => {
      this.sliders = Object.keys(PARAMS).reduce((output, param) => {
        const element = this.root.getElementById(`${param}-slider`);
        element.setValue(this.grainInstrument[param], true);
        return Object.assign(output, { [param]: element });
      }, {});
    });

    this.sampler = this.root.getElementById('sampler');
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.schedulable);
    audioEventBus.unsubscribe(this.audioEventSubscription);
  }

  scheduleAudio(message) {
    if (this.isContinuouslyPlaying) { return; }
    // const { note, onTime, offTime, value, } = message;
    const { note, time, duration, value, } = message;
    const onTime = time.audio;
    const offTime = onTime + duration;
    // TODO: make this a paramater of the grainInstrument
    const tempo = metronomeManager.getMetronome().getTempo();
    const deltaTimeStep = tempo / 60 / 128; // GET TICK LENGTH?
    const numberOfGrains =  (offTime - onTime) / deltaTimeStep;
    const timeScatter = this.grainInstrument.timeScatter * Math.random(); // NOTE: this only scatters in positive direction


    const grainSchedules = new Array(numberOfGrains).fill(null)
      .map((nullVal, index) => onTime + (index * deltaTimeStep))
      .map(schedule => schedule + this.grainInstrument.timeScatter * Math.random());

    // let voiceSpread = this.voiceSpread * i;
    const playShedule = onTime + timeScatter;
    // if (Math.random() <= this.playThreshold) {
      // this.sampler.schedule(playShedule);
    // }

    grainSchedules.forEach(schedule => this.sampler.schedule(schedule));
  }

  scheduleTicks(onTime) {
    const tickLength = metronomeManager.getMetronome().getTickLength();
    const deltaTimeStep = tickLength / this.grainInstrument.grainsPerTick;
    const schedules = IntArray(this.grainInstrument.grainsPerTick)
      .map(index => onTime + (index * deltaTimeStep))
      .map(schedule => schedule + this.grainInstrument.timeScatter * Math.random())
      .forEach(schedule => this.sampler.schedule(schedule));
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

  onGrainsPerTickUpdate(value) {
    const discreetValue = Math.floor(value * 8) + 1;
    this.grainInstrument.grainsPerTick = discreetValue;
    this.output.grainsPerTick.innerText = discreetValue;
  }

  onContinuousToggle(value) {
    this.isContinuouslyPlaying = !this.isContinuouslyPlaying;
    this.isContinuouslyPlaying ?
      metronomeManager.getScheduler().register(this.schedulable) :
      metronomeManager.getScheduler().deregister(this.schedulable);
  }

  buildSchedulable() {
    return {
      processTick: (tickNumber, time) => this.scheduleTicks(time.audio),
      render: (tick, lastTick) => {},
      start: () => console.log('grain schedule start'),
      stop: () => console.log('grain schedule stop')
    };
  }
}

export default new Component(COMPONENT_NAME, GrainMaker);
