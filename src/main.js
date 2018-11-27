import 'components/_util/componentManager';
import App from 'components/app';
import { loadSamples } from 'services/audio/sampleBank';
// import { initListeners } from 'services/EventBus/listeners';

document.addEventListener('DOMContentLoaded', () => {
  loadSamples();
  // initListeners();
  document.body.appendChild(new App.element());
});
