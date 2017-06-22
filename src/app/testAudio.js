import Http from '../app/util/http';
import provideAudioGraph from '../app/audioGraph/audioGraphProvider';
import {mtof} from './midi/util';
import {aeolian} from '../app/scale/scales';
import ScaleHelper from '../app/scale/scaleHelper';

const audioGraph = provideAudioGraph();
const samples = {};
const synthScale = getProgressiveScale(aeolian);
let baseNote = 60;

function playSample(audioContext, audioBuffer, scheduledTime) {
  const sampler = audioContext.createBufferSource();
  sampler.buffer = audioBuffer;
  //sampler.playbackRate.value = 1;
  sampler.connect(audioGraph.getOutput());
  sampler.start(scheduledTime);
}

export function sample(scheduledTime) {
  playSample(audioGraph.getAudioContext(), samples.hat, scheduledTime);
}

function loadSample(sampleKey, sampleUrl) {
  Http.getAudioBuffer(sampleUrl)
    .then(compressedBuffer => audioGraph.getAudioContext().decodeAudioData(compressedBuffer))
    .then(sampleBuffer => {
      samples[sampleKey] = sampleBuffer;
    })
    .catch(error => console.log('error', error));
}

function getProgressiveScale(scale) {
  let runningTotal = 0;
  const clone = scale.map(value => value);
  clone.unshift(0);

  return clone.map(value => {
    runningTotal += value;
    return runningTotal;
  });
}

export default function initTestAudio() {
  let audioBuffer;
  loadSample('hat', 'assets/audio/hat_loFi.wav');
  loadSample('snare', 'assets/audio/snare_gb03.wav');
  loadSample('kick', 'assets/audio/eKick1.wav');

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



  const audioSchedulable =  {
    processTick: (tickNumber, time) => {
      if (tickNumber % 2 === 0) {
        playSample(audioGraph.getAudioContext(), samples.hat, time.audio);
      }
      if (tickNumber % 4 === 0) {
        playSample(audioGraph.getAudioContext(), samples.kick, time.audio);
      }
      if (tickNumber % 8 === 0) {
        playSample(audioGraph.getAudioContext(), samples.snare, time.audio);
      }
    },
    render: (beatNumber, lastBeatNumber) => {},
    start: () => console.log('audio sampler start'),
    stop: () => console.log('audio sampler stop')
  };

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
    synthSchedulable,
    audioSchedulable
  };

}
