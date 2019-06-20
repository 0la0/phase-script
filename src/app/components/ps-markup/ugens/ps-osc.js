import PsBase from '../ps-base';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import ContinuousOscillator from 'services/audio/ContinuousOscillator';
import { InputType, } from 'services/AudioParameter/SignalParameter';
import ContinuousParam from '../util/ContinuousParam';
import metronomeManager from 'services/metronome/metronomeManager';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';

export default class PsEnvOsc extends PsBase {
  static get tag() {
    return 'ps-osc';
  }

  static get observedAttributes() {
    return [ 'wav', 'frequency', 'modulator' ];
  }

  constructor() {
    super();
    this.isMounted = false;
  }

  connectedCallback() {
    console.log('ps-osc connected');
    this.isMounted = true;

    const waveform = this.getAttribute('wav');
    this.osc = new ContinuousOscillator(440, waveform);
    this.audioModel = new UgenConnection('CONTINUOUS_OSC', this.osc, UgenConnectinType.EMPTY, UgenConnectinType.SIGNAL);
    
    this.paramMap = {
      frequency: new ContinuousParam({
        attrName: 'frequency',
        param: this.osc.getFrequencyParam(),
        inputType: new InputType().numeric().message().signal(),
        defaultValue: 440,
        element: this,
      }),
      wav: {
        setValue: val => console.log('TODO: set waveform', val),
        disconnect: () => {},
      },
      modulator: new ContinuousParam({
        attrName: 'modulator',
        param: this.osc.getFrequencyParam(),
        inputType: new InputType().signal(),
        defaultValue: 440,
        element: this,
      }),
    };

    this.audioModel.connectTo(this.parentNode.audioModel);
    this.metronomeSchedulable = new MetronomeScheduler({
      start: () => {
        this.osc.startAtTime();
        console.log('starting')
      },
      stop: () => this.osc.stop(),
    });
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
    if (metronomeManager.getMetronome().isRunning) {
      this.osc.startAtTime();
    }
  }

  disconnectedCallback() {
    console.log('ps-osc disconnected');
    Object.keys(this.paramMap).forEach(key => this.paramMap[key].disconnect());
    this.audioModel.disconnect();
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (!this.isMounted) { return; }
    const param = this.paramMap[attrName];
    if (!param) {
      throw new Error(`Observed attribute not mapped ${attrName}`);
    }
    param.setValue(newVal);
  }
}
