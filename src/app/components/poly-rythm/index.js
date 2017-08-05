import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import metronomeManager from 'services/metronome/metronomeManager';
import provideEventBus from 'services/EventBus/eventBusProvider';

const COMPONENT_NAME = 'poly-rythm';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const eventBus = provideEventBus();

const LENGTH = 16;
const ACTIVE_CELL_CLASS = 'poly-rythm__cell--active';

function buildGrid(numCells) {
  const elementList = new Array(numCells).fill(null)
    .map(nullVal => document.createElement('div'))
    .map((ele, index) => {
      ele.classList.add('poly-rythm__cell');
      ele.id = index;
      return ele;
    });
  return elementList;
}

class PolyRythm extends BaseComponent {

  constructor() {
    super(style, markup);
    this.isDirty = true;
    this.isRunning = false;
    this.activeIndex = 0;
    this.nextActiveIndex = this.activeIndex;
    this.previousIndex = this.activeIndex;
    this.upperBound = this.activeIndex;
    this.outputProcessor = this.root.getElementById('message-filter');
  }

  connectedCallback() {
    const column = this.root.getElementById('column');
    this.gridElementList = buildGrid(LENGTH);

    this.gridElementList.forEach(ele => column.appendChild(ele));

    column.addEventListener('click', event => {
      this.nextActiveIndex = parseInt(event.target.id);
      this.isDirty = true;
    });

    const schedulable = this.buildSchedulable();
    const scheduler = metronomeManager.getScheduler();
    scheduler.register(schedulable);


    this.channel = this.getAttribute('channel');
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  stop() {
    this.isRunning = false;
  }

  processTick(scheduledTime) {
    this.previousIndex = this.activeIndex;
    this.activeIndex = (this.activeIndex === LENGTH - 1) ? this.upperBound : this.activeIndex + 1;

    const isTriggered = this.activeIndex === LENGTH - 1;
    if (isTriggered) {
      const message = {
        address: 'TR-09',
        note: this.channel,
        scheduledTime,
        timeOption: 'midi'
      };
      this.outputProcessor.processMessage(message);
    }
  }

  render() {
    // console.log(this.previousIndex, this.activeIndex);
    try {
      this.gridElementList[this.previousIndex].classList.remove(ACTIVE_CELL_CLASS);
      this.gridElementList[this.activeIndex].classList.add(ACTIVE_CELL_CLASS);
    }
    catch(error) {
      console.log('wtf', error);
      console.log('indices', this.previousIndex, this.activeIndex);
    }

  }

  buildSchedulable() {
    return {
      processTick: (tickNumber, time) => {

        if (this.isRunning && this.isDirty) {
          const tick = tickNumber % LENGTH;
          if (tick === this.nextActiveIndex) {
            this.previousIndex = this.activeIndex;
            this.activeIndex = this.nextActiveIndex;
            this.upperBound = this.activeIndex;
            this.nextActiveIndex = 0;
            this.isDirty = false;
            this.render();
            this.processTick(time);
          }
        }
        else {
          if (this.isRunning && !this.isDirty) {
            this.processTick(time);
          }
        }
      },
      render: (beatNumber, lastBeatNumber) => {
        if (!this.isRunning) return;
        this.render();
      },
      start: () => {},
      stop: () => {
        this.isRunning = false;
        this.isDirty = true;
      }
    };
  }

  onToggle() {
    this.isRunning = !this.isRunning;
  }

}

export default new Component(COMPONENT_NAME, PolyRythm);
