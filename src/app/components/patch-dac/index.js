import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'patch-dac';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {

};

class PatchDac extends BaseComponent {

  constructor() {
    super(style, markup, domMap);
  }

  connectedCallback() {}

  getConnectionFeatures() {
    return {
      hasInput: true,
      hasOutput: false,
    };
  }
}

export default new Component(COMPONENT_NAME, PatchDac);
