import provideAudioGraph from 'services/audioGraph/audioGraphProvider';
import {mtof} from './midi/util';

const audioGraph = provideAudioGraph();

function buildSynth() {
  let audioBuffer;

  const osc1 = audioGraph.getAudioContext().createOscillator();
  const osc2 = audioGraph.getAudioContext().createOscillator();
  const oscGain = audioGraph.getAudioContext().createGain();
  oscGain.gain.value = 0.5;

  osc1.type = 'square';
  osc1.frequency.value = mtof(baseNote);
  osc2.type = 'sine';
  osc2.frequency.value = mtof(baseNote);

  osc1.connect(oscGain);
  osc2.connect(oscGain);
  oscGain.connect(audioGraph.getOutput());

  const synthSchedulable = {
    processTick: (tickNumber, time) => {
      if (tickNumber % 16 === 0) {
        // change note
        const noteIndex = Math.floor(Math.random() * synthScale.length);
        const midiNote = -12 + synthScale[noteIndex];
        const frequency1 = mtof(baseNote + -12 + synthScale[noteIndex]);
        const frequency2 = mtof(baseNote + midiNote);

        console.log(midiNote);

        osc1.frequency.value = frequency1;
        osc2.frequency.value = frequency2;
      }
    },
    render: (beatNumber, lastBeatNumber) => {},
    start: () => {
      osc1.start();
      osc2.start();
      console.log('synth start');
    },
    stop: () => {
      osc1.stop();
      osc2.stop();
      console.log('synth stop');
    },
  };

  return {
    synthSchedulable
  };

}
