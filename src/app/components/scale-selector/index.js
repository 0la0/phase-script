import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import scales from 'services/scale/scales';
import scaleHelper from 'services/scale/scaleHelper';

const COMPONENT_NAME = 'scale-selector';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class ScaleSelector extends BaseComponent {

  constructor() {
    super(style, markup);
    this.selector = this.shadowRoot.getElementById('selector');
  }

  connectedCallback() {
    Object.keys(scales)
      .map(scale => {
        const option = document.createElement('option');
        option.value = scale;
        option.innerText = scale;
        return option;
      })
      .forEach(ele => this.selector.appendChild(ele));

    this.selector.addEventListener('change', $event => this.setScaleValue());
    this.setScaleValue();
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  setScaleValue() {
    const key = this.selector[this.selector.selectedIndex].value;
    const scale = scales[key];
    scaleHelper.setScale(scale);
  }

}

export default new Component(COMPONENT_NAME, ScaleSelector);
