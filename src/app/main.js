import metronomeManager from '../app/metronome/metronomeManager';
import buildMidiFactory from '../app/midi/midiDeviceFactory';
import {buildMidiEventBus} from '../app/midi/midiEventBus';
import buildSchedulable from '../app/rolandTest';
import initTestAudio from './testAudio';


metronomeManager.init();
const scheduler = metronomeManager.getScheduler();
const metronome = metronomeManager.getMetronome();


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
  const schedulables = initTestAudio();

  // scheduler.register(schedulables.synthSchedulable);
  // scheduler.register(schedulables.audioSchedulable);
}
