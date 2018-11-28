import 'components/_util/componentManager';
import App from 'components/app';
import { loadSamples } from 'services/audio/sampleBank';

document.addEventListener('DOMContentLoaded', () => {
  loadSamples();
  document.body.appendChild(new App.element());
});
