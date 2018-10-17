import audioGraph from 'services/audio/graph';
import Metronome from './metronome';
import Scheduler from './scheduler';

class MetronomeManager {
  constructor() {
    this.scheduler = new Scheduler(audioGraph.getAudioContext());
    this.metronome = new Metronome(audioGraph.getAudioContext(), this.scheduler);
  }

  getScheduler() {
    return this.scheduler;
  }

  getMetronome() {
    return this.metronome;
  }
}

const metronomeManager = new MetronomeManager();
export default metronomeManager;
