import './init';
import initTestAudio from '../app/testAudio';
import '../app/components/_util/componentManager';

const globalStyles = require('./main.css');

export function initMain () {
  const entrypoint = document.getElementById('entrypoint');
  entrypoint.innerHTML = `<style>${globalStyles}</style><app-entry></app-entry>`;

  const schedulables = initTestAudio();
}

document.addEventListener('DOMContentLoaded', initMain());
