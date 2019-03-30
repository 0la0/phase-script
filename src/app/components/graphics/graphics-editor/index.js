import BaseComponent from 'components/_util/base-component';
import CycleManager from 'services/EventCycle/CycleManager';
import style from './graphics-editor.css';
import markup from './graphics-editor.html';

const KEY_CODE_ENTER = 13;

const dom = [ 'cycleInput', ];

export default class GraphicsEditor extends BaseComponent {
  static get tag() {
    return 'graphics-editor';
  }

  constructor() {
    super(style, markup, dom);
    this.cycleLength = 16;
    this.isOn = true;
    this.cycleManager = new CycleManager();
  }

  connectedCallback() {
    this.dom.cycleInput.addEventListener('keydown', event => {
      event.stopPropagation();
      if (event.keyCode === KEY_CODE_ENTER && event.metaKey) {
        event.preventDefault();
        this.handleCycleChange(this.dom.cycleInput.innerText);
        return;
      }
    });

    const testCycleValue = `osc.sin(10, 10, 10)`;
    this.dom.cycleInput.innerText = testCycleValue;
    this.handleCycleChange(testCycleValue);
  }

  handleCycleChange(cycleString) {
    console.log('handleCycleChange', cycleString);
  }
}
