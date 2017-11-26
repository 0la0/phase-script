import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'grain-maker';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

// positionOutput
// spreadOutput
// loopDurationOutput
// timeScatterOutput
// numVoicesOutput

class GrainMaker extends BaseComponent {

  constructor() {
    super(style, markup);
  }

  connectedCallback() {
    this.output = {
      position: this.root.getElementById('positionOutput'),
      spread: this.root.getElementById('spreadOutput'),
      loopDuration: this.root.getElementById('loopDurationOutput'),
      timeScatter: this.root.getElementById('timeScatterOutput'),
      numVoices: this.root.getElementById('numVoicesOutput'),
    };
  }

  onPositionUpdate(event) {
    this.output.position.innerText = event;
  }

  onSpreadUpdate(event) {
    this.output.spread.innerText = event;
  }

  onLoopDurationUpdate(event) {
    this.output.loopDuration.innerText = event;
  }

  onTimeScatterUpdate(event) {
    this.output.timeScatter.innerText = event;
  }

  onNumVoicesUpdate(event) {
    this.output.numVoices.innerText = event;
  }

}

export default new Component(COMPONENT_NAME, GrainMaker);
