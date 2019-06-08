import PsBase from '../ps-base';
import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import AudioEventToModelAdapter from 'services/UgenConnection/AudioEventToModelAdapter';
import envelopedOscilator from 'services/audio/EnvelopedOscillator';
import DiscreteSignalParameter from 'services/AudioParameter/DiscreteSignalParameter';
import { msToSec } from 'services/Math';
import Subscription from 'services/EventBus/Subscription';
// import AudioEventToModelAdapter from 'services/UgenConnection/AudioEventToModelAdapter';
import { audioEventBus } from 'services/EventBus';


export default class PsEnvOsc extends PsBase {
  static get tag() {
    return 'ps-env-osc';
  }

  connectedCallback() {
    // GlobalListeners.init();
    console.log('ps-env-osc connected');
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new UgenConnection('ENVELOPED_OSC', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.SIGNAL);
    this.modulationInputs = new Set();
    this.waveform = 'sin';
    this.paramMap = {
      attack: new DiscreteSignalParameter(0, msToSec),
      sustain: new DiscreteSignalParameter(0, msToSec),
      release: new DiscreteSignalParameter(100, msToSec),
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
      .setAddress('a')
      .setOnNext(message => this.schedule(message));
    audioEventBus.subscribe(this.audioEventSubscription);

    console.log('osc parent', this.parentNode, this.parentNode.audioModel);

    this.audioModel.connectTo(this.parentNode.audioModel);
  }

  disconnectedCallback() {
    // super.disconnectedCallback();
    console.log('ps-env-osc disconnected');
    // this.audioModel.disconnect();
    audioEventBus.unsubscribe(this.audioEventSubscription);
  }

  schedule(message) {
    // console.log('markup scheduling', message)
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
}
