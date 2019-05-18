import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import AudioEventToModelAdapter from 'services/UgenConnection/AudioEventToModelAdapter';
import envelopedOscilator from 'services/audio/EnvelopedOscillator';
import DiscreteSignalParameter from 'services/AudioParameter/DiscreteSignalParameter';
import { msToSec } from 'services/Math';

export default class EnvelopedOsc extends BaseUnitGenerator {
  constructor(waveform, attack, sustain, release) {
    super();
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new UgenConnection('ENVELOPED_OSC', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.SIGNAL);
    this.modulationInputs = new Set();
    this.waveform = waveform;
    this.paramMap = {
      attack: new DiscreteSignalParameter(attack, msToSec),
      sustain: new DiscreteSignalParameter(sustain, msToSec),
      release: new DiscreteSignalParameter(release, msToSec),
      modulator: {
        setParamValue: paramVal => {
          if (!(paramVal instanceof PatchAudioModel)) {
            throw new Error('Modulator must be a PatchAudioModel');
          }
          this.modulationInputs.add(paramVal.getConnectionFn());
        }
      },
    };
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

  static fromParams({ waveform, attack, sustain, release }) {
    return new EnvelopedOsc(waveform, attack, sustain, release);
  }
}
