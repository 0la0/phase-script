import 'components/_util/componentManager';
import App from 'components/app';
import { loadSamples } from 'services/audio/sampleBank';
import { initListeners } from 'services/EventBus/listeners';

function applyGlobalStyles() {
  const globalStyles = {
    width: '100%',
    height: '100%',
    position: 'relative',
    margin: 0,
    padding: 0,
    'background-color': '#333333',
    color: '#DDDDDD',
    'font-family': 'helvetica, arial, sans-serif',
    'font-size': '12px'
  };
  Object.keys(globalStyles).forEach((key) => {
    document.body.style.setProperty(key, globalStyles[key]);
    document.documentElement.style.setProperty(key, globalStyles[key]);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSamples();
  initListeners();
  applyGlobalStyles();
  document.body.appendChild(new App.element());
});
