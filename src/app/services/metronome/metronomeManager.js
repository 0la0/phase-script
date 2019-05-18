import audioGraph from 'services/audio/Graph';
import Metronome from './metronome';
import Scheduler from './scheduler';

class MetronomeManager {
  constructor() {
    this.scheduler = new Scheduler();
    this.metronome = new Metronome(audioGraph.getAudioContext(), this.scheduler);
  }

  // TODO: remove this method and instead provide register / deregister methods
  getScheduler() {
    return this.scheduler;
  }

  getMetronome() {
    return this.metronome;
  }
}

const metronomeManager = new MetronomeManager();
export default metronomeManager;
