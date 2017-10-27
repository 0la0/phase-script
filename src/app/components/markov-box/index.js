import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import buildGrid from './modules/gridBuilder';
import metronomeManager from 'services/metronome/metronomeManager';
import eventBus from 'services/EventBus';

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
      this.previousIndex = this.activeIndex;
      this.activeIndex = event.target.id;
      this.render();
    });

    const schedulable = this.buildSchedulable();
    const scheduler = metronomeManager.getScheduler();
    scheduler.register(schedulable);
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  stop() {
    this.isRunning = false;
  }

  processTick(scheduledTime) {
    const currentNode = this.grid.elementList[this.activeIndex];
    const nextState = currentNode.getNextState();
    const nextIndex = nextState.edge;
    const nextNode = this.grid.elementList[nextIndex];

    this.previousIndex = this.activeIndex;
    this.activeIndex = nextIndex;

    if (nextNode.isActive) {
      eventBus.publish({
        address: 'TR-09',
        time: scheduledTime.midi
      });
    }
  }

  render() {
    this.grid.elementList[this.previousIndex].turnOff();
    this.grid.elementList[this.activeIndex].turnOn();
  }

  buildSchedulable() {
    return {
      processTick: (tickNumber, time) => this.processTick(time),
      render: (beatNumber, lastBeatNumber) => this.render(),
      start: () => {},
      stop: () => {
        this.grid.elementList[this.activeIndex].turnOff();
      }
    };
  }

}

export default new Component(COMPONENT_NAME, MarkovBox);
