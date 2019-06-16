import PsBase from '../ps-base';
import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import AudioEventToModelAdapter from 'services/UgenConnection/AudioEventToModelAdapter';
import envelopedOscilator from 'services/audio/EnvelopedOscillator';
import { msToSec } from 'services/Math';
import Subscription from 'services/EventBus/Subscription';
import { audioEventBus } from 'services/EventBus';
import DiscreteParameter, { InputType, } from '../util/DiscreteParam';

export default class PsEnvOsc extends PsBase {
  static get tag() {
    return 'ps-env-osc';
  }

  static get observedAttributes() {
    return [ 'attack', 'sustain', 'release', 'wav' ];
  }

  constructor() {
    super();
    this.isMounted = false;
  }

  connectedCallback() {
    this.isMounted = true;
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new UgenConnection('ENVELOPED_OSC', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.SIGNAL);
    this.modulationInputs = new Set();

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
      // TODO: make as ContinuousParam
      modulator: {
        setValue: paramVal => {
          if (!(paramVal instanceof UgenConnection)) {
            throw new Error('Modulator must be a UgenConnection');
          }
          this.modulationInputs.add(paramVal.getConnectionFn());
        }
      },
    };

    // TODO: make as TriggerParameter
    this.audioEventSubscription = new Subscription()
      .setAddress(this.getAttribute('trigger'))
      .setOnNext(message => this.schedule(message));
    audioEventBus.subscribe(this.audioEventSubscription);

    this.audioModel.connectTo(this.parentNode.audioModel);
  }

  disconnectedCallback() {
    console.log('ps-env-osc disconnected');
    audioEventBus.unsubscribe(this.audioEventSubscription);
    Object.keys(this.paramMap).forEach(key => this.paramMap[key].disconnect());
  }

  schedule(message) {
    setTimeout(() => {
      const note = message.note !== undefined ? message.note : 60;
      const outputs = [...this.eventModel.getOutlets()];
      const waveform = this.paramMap.wav.getValueForTime(message.time);
      const asr = {
        attack: this.paramMap.attack.getValueForTime(message.time),
        sustain: this.paramMap.sustain.getValueForTime(message.time),
        release: this.paramMap.release.getValueForTime(message.time),
      };
      envelopedOscilator(note, message.time.audio, asr, waveform, 1, outputs, this.modulationInputs);
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
