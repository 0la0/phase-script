import PsBase from '../ps-base';
import Gain from 'services/audio/gain';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import { InputType, } from 'services/AudioParameter/SignalParameter';
import ContinuousParam from '../util/ContinuousParam';

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
    console.log('ps-gain connected');
    const gain = new Gain();
    
    this.isMounted = true;
    this.audioModel = new UgenConnection('GAIN', gain, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
    // this.paramMap = {
    //   value: new SignalParameter(gain.getGainParam(), defaultValue, new InputType().numeric().message().signal().build()),
    // };

    if (this.parentNode.audioModel) {
      this.audioModel.connectTo(this.parentNode.audioModel);
    }
    this.paramTest = new ContinuousParam({
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
    this.paramTest.setValue(newVal);
  }
}
