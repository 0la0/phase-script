import PsBase from '../ps-base';
import Gain from 'services/audio/gain';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import SignalParameter, { InputType, } from 'services/AudioParameter/SignalParameter';
import Subscription from 'services/EventBus/Subscription';
import { audioEventBus } from 'services/EventBus';

const PARENTHESES = /\(([^)]+)\)/;

class ParamTest {
  constructor({ attrName, param, inputType, defaultValue, element, }) {
    this.attrName = attrName;
    this.param = param;
    this.inputType = inputType;
    this.defaultValue = defaultValue;
    this.element = element;
    this.audioEventSubscription;
    this.setDefaultValue();
    setTimeout(() => this.extractVal(element, element.getAttribute(attrName)));
  }

  disconnect() {
    this.element = null;
    this.param = null;
    
    if (this.audioEventSubscription) {
      audioEventBus.unsubscribe(this.audioEventSubscription);
    }
  }

  setDefaultValue() {
    this.param.linearRampToValueAtTime(this.defaultValue, 0);
  }

  extractVal(element, val) {
    if (val === null) {
      return this.setDefaultValue();
    }
    if (this.inputType.isMessage && val.indexOf('addr') === 0) {
      const match = val.match(PARENTHESES);
      if (!match) {
        console.log(`error paring address ${val}`);
        return this.setDefaultValue();
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
      return;
    }
    if (this.inputType.isSignal && val.indexOf('mod') === 0) {
      const match = val.match(PARENTHESES);
      if (!match) {
        console.log(`error paring modulation value ${val}`);
        return this.setDefaultValue();
      }
      const target = element.getRootNode().getElementById(match[1]);
      if (!target) {
        return this.setDefaultValue();
      }
      
      if (target && target.audioModel) {
        target.audioModel.connectTo({
          getInputType: () => 'SIGNAL',
          getAudioModelInput: () => this.param,
        });
        return;
      }
      return this.setDefaultValue();
    }
    const numericValue = parseFloat(val, 10);
    if (this.inputType.isNumeric && !Number.isNaN(numericValue)) {
      this.param.linearRampToValueAtTime(numericValue, 0);
      return;
    }
    console.log(`error classifying ${val}`);
  }
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
    
    this.isMounted = true;
    this.audioModel = new UgenConnection('GAIN', gain, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
    // this.paramMap = {
    //   value: new SignalParameter(gain.getGainParam(), defaultValue, new InputType().numeric().message().signal().build()),
    // };

    if (this.parentNode.audioModel) {
      this.audioModel.connectTo(this.parentNode.audioModel);
    }
    this.paramTest = new ParamTest({
      attrName: 'value',
      param: gain.getGainParam(),
      inputType: new InputType().numeric().message().signal(),
      defaultValue: 0.2,
      element: this,
    });
  }

  disconnectedCallback() {
    console.log('ps-gain disconnected');
    this.paramTest.disconnect();
    this.audioModel.disconnect();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (!this.isMounted) { return; }
    this.paramTest.extractVal(this, newVal);
  }
}
