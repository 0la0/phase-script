import PsBase from '../ps-base';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import AudioEventToModelAdapter from 'services/UgenConnection/AudioEventToModelAdapter';
import envelopedOscilator from 'services/audio/EnvelopedOscillator';
import { msToSec } from 'services/Math';
import DiscreteParameter, { InputType, } from '../util/DiscreteParam';
import TriggerParameter from '../util/TriggerParameter';
import DiscreteModulationParam from '../util/DiscreteModulationParam';

export default class PsEnvOsc extends PsBase {
  static get tag() {
    return 'ps-env-osc';
  }

  static get observedAttributes() {
    return [ 'attack', 'sustain', 'release', 'wav', 'trigger', 'modulator' ];
  }

  constructor() {
    super();
    this.isMounted = false;
  }

  connectedCallback() {
    this.isMounted = true;
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new UgenConnection('ENVELOPED_OSC', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.SIGNAL);

    this.paramMap = {
      attack: new DiscreteParameter({
        attrName: 'attack',
        inputType: InputType.number,
        defaultValue: 0,
        element: this,
        transform: msToSec,
        isAddressable: true
      }),
      sustain: new DiscreteParameter({
        attrName: 'sustain',
        inputType: InputType.number,
        defaultValue: 0,
        element: this,
        transform: msToSec,
        isAddressable: true
      }),
      release: new DiscreteParameter({
        attrName: 'release',
        inputType: InputType.number,
        defaultValue: 100,
        element: this,
        transform: msToSec,
        isAddressable: true
      }),
      wav: new DiscreteParameter({
        attrName: 'wav',
        inputType: InputType.string,
        defaultValue: 'sin',
        element: this,
        isAddressable: false,
      }),
      trigger: new TriggerParameter({
        attrName: 'trigger',
        element: this,
        eventHandler: this.schedule.bind(this),
      }),
      modulator: new DiscreteModulationParam({
        attrName: 'modulator',
        element: this,
      }),
    };
    this.audioModel.connectTo(this.parentNode.audioModel);
  }

  disconnectedCallback() {
    console.log('ps-env-osc disconnected');
    Object.keys(this.paramMap).forEach(key => this.paramMap[key].disconnect());
  }

  schedule(message) {
    setTimeout(() => {
      const note = message.note !== undefined ? message.note : 60;
      const outputs = [...this.eventModel.getOutlets()];
      const waveform = this.paramMap.wav.getValueForTime(message.time);
      const modulationInputs = this.paramMap.modulator.modulationInputs;
      const asr = {
        attack: this.paramMap.attack.getValueForTime(message.time),
        sustain: this.paramMap.sustain.getValueForTime(message.time),
        release: this.paramMap.release.getValueForTime(message.time),
      };
      envelopedOscilator(note, message.time.audio, asr, waveform, 1, outputs, modulationInputs);
    });
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
