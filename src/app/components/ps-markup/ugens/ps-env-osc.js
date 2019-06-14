import PsBase from '../ps-base';
import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import AudioEventToModelAdapter from 'services/UgenConnection/AudioEventToModelAdapter';
import envelopedOscilator from 'services/audio/EnvelopedOscillator';
import DiscreteSignalParameter from 'services/AudioParameter/DiscreteSignalParameter';
import { msToSec } from 'services/Math';
import Subscription from 'services/EventBus/Subscription';
import { audioEventBus } from 'services/EventBus';

function parseNumOrDefault(value, defaultValue) {
  const val = parseFloat(value, 10);
  if (Number.isNaN(val)) {
    return defaultValue;
  }
  return val;
}

function getNumericAttribute(name, defaultValue) {
  if (!this.hasAttribute(name)) {
    return defaultValue;
  }
  return parseNumOrDefault(this.getAttribute(name), defaultValue);
}

function getStringAttribute(name, defaultValue) {
  if (!this.hasAttribute(name)) {
    return defaultValue;
  }
  return this.getAttribute(name) || defaultValue;
}

export default class PsEnvOsc extends PsBase {
  static get tag() {
    return 'ps-env-osc';
  }

  static get observedAttributes() {
    return [ 'attack', 'sustain', 'release', 'wav' ];
  }

  connectedCallback() {
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new UgenConnection('ENVELOPED_OSC', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.SIGNAL);
    this.modulationInputs = new Set();
    
    const attack = getNumericAttribute.call(this, 'attack', 0);
    const sustain = getNumericAttribute.call(this, 'sustain', 0);
    const release = getNumericAttribute.call(this, 'release', 100);
    this.waveform = getStringAttribute.call(this, 'wav', 'sin');
    
    this.paramMap = {
      attack: new DiscreteSignalParameter(attack, msToSec),
      sustain: new DiscreteSignalParameter(sustain, msToSec),
      release: new DiscreteSignalParameter(release, msToSec),
      wav: { setParamValue: waveform => this.waveform = waveform },
      modulator: {
        setParamValue: paramVal => {
          if (!(paramVal instanceof UgenConnection)) {
            throw new Error('Modulator must be a UgenConnection');
          }
          this.modulationInputs.add(paramVal.getConnectionFn());
        }
      },
    };

    this.audioEventSubscription = new Subscription()
      .setAddress(this.getAttribute('trigger'))
      .setOnNext(message => this.schedule(message));
    audioEventBus.subscribe(this.audioEventSubscription);

    this.audioModel.connectTo(this.parentNode.audioModel);
  }

  disconnectedCallback() {
    console.log('ps-env-osc disconnected');
    audioEventBus.unsubscribe(this.audioEventSubscription);
  }

  schedule(message) {
    setTimeout(() => {
      const note = message.note !== undefined ? message.note : 60;
      const outputs = [...this.eventModel.getOutlets()];
      const asr = {
        attack: this.paramMap.attack.getValueForTime(message.time),
        sustain: this.paramMap.sustain.getValueForTime(message.time),
        release: this.paramMap.release.getValueForTime(message.time),
      };
      envelopedOscilator(note, message.time.audio, asr, this.waveform, 1, outputs, this.modulationInputs);
    });
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (!this.paramMap) { return; }
    console.log('attributeChanged', attrName, oldVal, newVal);
    const param = this.paramMap[attrName];
    if (!param) {
      throw new Error(`Observed attribute not mapped ${attrName}`);
    }
    const val = parseFloat(newVal, 10);
    console.log('val', val)
    if (Number.isNaN(val)) {
      throw new Error(`Non-numeric attribute: ${attrName}`);
    }
    param.setParamValue(val);
  }
}
