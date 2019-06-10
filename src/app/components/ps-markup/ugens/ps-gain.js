import PsBase from '../ps-base';
import Gain from 'services/audio/gain';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import SignalParameter, { InputType, } from 'services/AudioParameter/SignalParameter';

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

  connectedCallback() {
    this.gain = new Gain();
    this.audioModel = new UgenConnection('GAIN', this.gain, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
    
    const gain = getNumericAttribute.call(this, 'value', 0.4);
    this.paramMap = {
      value: new SignalParameter(this.gain.getGainParam(), gain, new InputType().numeric().message().signal().build()),
    };

    this.audioModel.connectTo(this.parentNode.audioModel);
  }

  disconnectedCallback() {
    console.log('ps-gain disconnected');
    this.audioModel.disconnect();
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
    param.setParamValue(val, { audio: 0 });
  }
}
