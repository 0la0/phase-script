import PsBase from '../ps-base';
import Gain from 'services/audio/gain';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import SignalParameter, { InputType, } from 'services/AudioParameter/SignalParameter';

export default class PsGain extends PsBase {
  static get tag() {
    return 'ps-gain';
  }

  connectedCallback() {
    const defaultGainValue = 0.5
    this.gain = new Gain();
    this.audioModel = new UgenConnection('GAIN', this.gain, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
    this.paramMap = {
      gainValue: new SignalParameter(this.gain.getGainParam(), defaultGainValue, new InputType().numeric().message().signal().build()),
    };

    this.audioModel.connectTo(this.parentNode.audioModel);
  }

  disconnectedCallback() {
    console.log('ps-gain disconnected');
    this.audioModel.disconnect();
  }
}
