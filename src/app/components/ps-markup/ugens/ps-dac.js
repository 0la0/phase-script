import PsBase from '../ps-base';
import Dac from 'services/audio/dac';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';

export default class PsDac extends PsBase {
  static get tag() {
    return 'ps-dac';
  }

  connectedCallback() {
    // GlobalListeners.init();
    console.log('ps-dac connected');
    this.audioModel = new UgenConnection('DAC', new Dac(), UgenConnectinType.SIGNAL, UgenConnectinType.EMPTY);
  }

  disconnectedCallback() {
    console.log('ps-dac disconnected');
    this.audioModel.disconnect();
  }
}
