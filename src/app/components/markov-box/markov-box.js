import BaseComponent from '../_util/base-component';
import Component from '../_util/component';
import buildGrid from './modules/gridBuilder';
import metronomeManager from '../../metronome/metronomeManager';

import {sample} from '../../testAudio';

const COMPONENT_NAME = 'markov-box';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class MarkovBox extends BaseComponent {

  constructor() {
    super(style, markup);
    this.width = 4;
    this.height = 4;
    this.activeIndex = 5;
    this.previousIndex = 0;
    this.isRunning = false;
  }

  connectedCallback() {
    this.grid = buildGrid(this.width, this.height, this);
    this.root.appendChild(this.grid.root);

    this.grid.root.addEventListener('click', event => {
      this.activeIndex = event.target.id;
      console.log('activeIndex:', this.activeIndex);
    });

    const schedulable = this.buildSchedulable();
    const scheduler = metronomeManager.getScheduler();
    scheduler.register(schedulable);
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  start() {
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  processTick(scheduledTime) {
    const currentNode = this.grid.elementList[this.activeIndex];
    const nextState = currentNode.getNextState();
    const nextIndex = nextState.edge;
    // const bucket = nextState.cumulativeProbability - nextState.normalProbability;

    this.previousIndex = this.activeIndex;
    this.activeIndex = nextIndex;

    if (currentNode.isActive) {
      sample(scheduledTime);
    }
  }

  render() {
    this.grid.elementList[this.previousIndex].turnOff();
    this.grid.elementList[this.activeIndex].turnOn();
  }

  buildSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        if (tickNumber % 4 === 0) {
          this.processTick(time.audio);
        }
      },
      render: (beatNumber, lastBeatNumber) => this.render(),
      start: () => console.log('markov box start'),
      stop: () => console.log('markov box stop')
    };
  }

}

export default new Component(COMPONENT_NAME, MarkovBox);
