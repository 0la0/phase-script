import './init';
import metronomeManager from '../app/metronome/metronomeManager';
import buildMidiFactory from '../app/midi/midiDeviceFactory';
import {buildMidiEventBus} from '../app/midi/midiEventBus';
import buildSchedulable from '../app/rolandTest';
import initTestAudio from '../app/testAudio';
import '../app/components/_util/componentManager';

const globalStyles = require('./main.css');

export function initMain () {

  const entrypoint = document.getElementById('entrypoint');
  entrypoint.innerHTML = `<style>${globalStyles}</style><app-entry></app-entry>`;


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

  const schedulables = initTestAudio();

  // scheduler.register(schedulables.synthSchedulable);
  // scheduler.register(schedulables.audioSchedulable);
}

document.addEventListener('DOMContentLoaded', initMain());
