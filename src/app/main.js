//Util Imports
import Http from '../app/util/http';

import AudioGraph from '../app/audioGraph/audioGraph';
import Metronome from '../app/metronome/metronome';
import Scheduler from '../app/metronome/scheduler';

//Midi Imports
import buildMidiFactory from '../app/midi/midiDeviceFactory';
import {
  buildMidiEventBus,
  getObjectFromMessage,
  getMessageFromObject
} from '../app/midi/midiEventBus';

import buildSchedulable from '../app/rolandTest';
import {getMessageFromObject} from '../app/midi/midiEventBus';

import {aeolian} from '../app/scale/scales';
import ScaleHelper from '../app/scale/scaleHelper';

let baseNote = 60;
// const scaleHelper = new ScaleHelper(aeolian);
const synthScale = getProgressiveScale(aeolian);


const audioGraph = new AudioGraph();
const scheduler = new Scheduler(audioGraph.getAudioContext());
const metronome = new Metronome(audioGraph.getAudioContext(), scheduler);

const samples = {};

export function initMain () {
  const midiEventBus = buildMidiEventBus();

  buildMidiFactory()
    .then(midiDeviceFactory => {
      const TB_03 = 'TB-03';
      const TB_03_INPUT = midiDeviceFactory.getInputByName(TB_03);
      const TB_03_OUTPUT = midiDeviceFactory.getOutputByName(TB_03);
 
      if (TB_03_OUTPUT) {
        const tbSchedulable = buildSchedulable(TB_03_OUTPUT);
        scheduler.register(tbSchedulable);
      }
      if (TB_03_INPUT) {
        TB_03_INPUT.onmidimessage = event => {
          if (event.data[0] === 248) return;
          console.log(event.data);
        };
      }      

    })
    .catch(error => console.error(error));

  initMetronomeButton(metronome);
  initTestAudio();
}

const onMessage = {
  command: 9,
  status: 1,
  note: 60,
  value: 64
};

const offMessage = {
  command: 8,
  status: 1,
  note: 60,
  value: 64
};

const keyMap = {
  65: 0,
  83: 5,
  68: 10,
  70: 12
};

const BASE_NOTE = 90;


function initTestAudio() {
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



  const audioSchedulable = {
    processTick: (tickNumber, time) => {
      //
      //
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
      //if (tickNumber % 16 === 0) {
        // change note
        const noteIndex = Math.floor(Math.random() * synthScale.length);
        const midiNote = -12 + synthScale[noteIndex];
        const frequency1 = mtof(baseNote + -12 + synthScale[noteIndex]);
        const frequency2 = mtof(baseNote + midiNote);

        console.log(midiNote);

        osc1.frequency.value = frequency1;
        osc2.frequency.value = frequency2;
      //}
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

  //scheduler.register(synthSchedulable);
  scheduler.register(audioSchedulable);
}

function loadSample(sampleKey, sampleUrl) {
  Http.getAudioBuffer(sampleUrl)
    .then(compressedBuffer => audioGraph.getAudioContext().decodeAudioData(compressedBuffer))
    .then(sampleBuffer => {
      samples[sampleKey] = sampleBuffer;
    })
    .catch(error => console.log('error', error));
}

function playSample(audioContext, audioBuffer, scheduledTime) {
  const sampler = audioContext.createBufferSource();
  sampler.buffer = audioBuffer;
  //sampler.playbackRate.value = 1;
  sampler.connect(audioGraph.getOutput());
  sampler.start(scheduledTime);
}


function mtof (midiNote) {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
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

function initMetronomeButton(metronome) {
  const metronomeButton = document.getElementById('metronomeButton');
  let isRunning = false;

  metronomeButton.addEventListener('click', event => {
    event.preventDefault();
    isRunning = !isRunning;
    if (isRunning) {
      metronome.start();
    }
    else {
      metronome.stop();
    }
  });

}

// document.addEventListener('DOMContentLoaded', init);
