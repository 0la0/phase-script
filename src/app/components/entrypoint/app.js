const COMPONENT_NAME = 'app';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

import {initMain} from '../../main.js';

import '../_util/componentManager.js';

function init() {
  const appElement = document.querySelector('app');
  appElement.innerHTML = `<style>${style}</style>${markup}`;

  initMain();
}

document.addEventListener('DOMContentLoaded', init);
