import metronomeManager from 'services/metronome/metronomeManager';
import { loadSamples } from 'services/audio/sampleBank';
import { initListeners } from 'services/EventBus/listeners';

// Logic to run immediately
(() => {
  metronomeManager.init();
  const scheduler = metronomeManager.getScheduler();
  const metronome = metronomeManager.getMetronome();
})()

// Logic to run upon DOM ready
export default function initApp() {
  loadSamples();
  initListeners();
}
