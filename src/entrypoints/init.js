import metronomeManager from '../app/metronome/metronomeManager';

(() => {
  metronomeManager.init();
  const scheduler = metronomeManager.getScheduler();
  const metronome = metronomeManager.getMetronome();
})()
