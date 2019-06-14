import PsBase from '../ps-base';
import Gain from 'services/audio/gain';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import SignalParameter, { InputType, } from 'services/AudioParameter/SignalParameter';
import Subscription from 'services/EventBus/Subscription';
import { audioEventBus } from 'services/EventBus';

const PARENTHESES = /\(([^)]+)\)/;

class ParamTest {
  constructor({ attrName, param, inputType, defaultValue, }) {
    this.attrName = attrName;
    this.param = param;
    this.inputType = inputType;
    this.defaultValue = defaultValue;
  }

  extractVal(element, val) {
    if (val === null) {
      return this.defaultValue;
    }
    if (this.inputType.isMessage && val.indexOf('addr') === 0) {
      const match = val.match(PARENTHESES);
      if (!match) {
        console.log(`error paring address ${val}`);
        return this.defaultValue;
      }
      const address = match[1];
      this.audioEventSubscription = new Subscription()
        .setAddress(address)
        .setOnNext(message => {
          message.interpolate ?
            this.param.linearRampToValueAtTime(message.note, message.time.audio) :
            this.param.setValueAtTime(message.note, message.time.audio);
        });
      audioEventBus.subscribe(this.audioEventSubscription);
      return val;
    }
    if (this.inputType.isSignal && val.indexOf('mod') === 0) {
      const match = val.match(PARENTHESES);
      if (!match) {
        console.log(`error paring modulation value ${val}`);
        return this.defaultValue;
      }
      const target = element.getRootNode().getElementById(match[1]);
      if (!target) { return this.defaultValue; }
      
      if (target && target.audioModel) {
        target.audioModel.connectTo({
          getInputType: () => 'SIGNAL',
          getAudioModelInput: () => this.param,
        });
        return;
      }
      return val;
    }
    const numericValue = parseFloat(val, 10);
    if (this.inputType.isNumeric && !Number.isNaN(numericValue)) {
      this.param.linearRampToValueAtTime(numericValue, 0);
      return;
    }
    console.log(`error classifying ${val}`);
  }
}

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

export default class PsGain extends PsBase {
  static get tag() {
    return 'ps-gain';
  }

  static get observedAttributes() {
    return [ 'value' ];
  }

  constructor() {
    super();
    this.isMounted = false;
  }

  connectedCallback() {
    const gain = new Gain();
    const defaultValue = getNumericAttribute.call(this, 'value', 0.4);

    this.isMounted = true;
    this.audioModel = new UgenConnection('GAIN', gain, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
    this.paramMap = {
      value: new SignalParameter(gain.getGainParam(), defaultValue, new InputType().numeric().message().signal().build()),
    };
    if (this.parentNode.audioModel) {
      this.audioModel.connectTo(this.parentNode.audioModel);
    }
    this.paramTest = new ParamTest({
      attrName: 'value',
      param: gain.getGainParam(),
      inputType: new InputType().numeric().message().signal(),
      defaultValue: 0.4,
    });
  }

  disconnectedCallback() {
    console.log('ps-gain disconnected');
    this.audioModel.disconnect();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (!this.isMounted) { return; }
    this.paramTest.extractVal(this, newVal);
  }
}
