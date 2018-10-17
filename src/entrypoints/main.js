import 'components/_util/componentManager';
import App from 'components/app';
import { loadSamples } from 'services/audio/sampleBank';
import { initListeners } from 'services/EventBus/listeners';

const globalStyles = require('./main.css');

function builDom() {
  const entrypoint = document.getElementById('entrypoint');
  const AppElement = new App.element();
  const styleElement = document.createElement('style');
  styleElement.innerText = globalStyles;
  entrypoint.appendChild(styleElement);
  entrypoint.appendChild(AppElement);
}

document.addEventListener('DOMContentLoaded', () => {
  loadSamples();
  initListeners();
  builDom();
});
