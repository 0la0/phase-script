import metronomeManager from 'services/metronome/metronomeManager';
// import initTestAudio from 'services/testAudio';
import {initSampler} from 'services/sampler';
import {initListeners} from 'services/EventBus/listeners';

// Logic to run immediately
(() => {
  metronomeManager.init();
  const scheduler = metronomeManager.getScheduler();
  const metronome = metronomeManager.getMetronome();
})()

// Logic to run upon DOM ready
export default function initApp() {
  initSampler();
  initListeners();
}
