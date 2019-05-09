import acid from './wv_acid.json';
import buzz from './wv_buzz.json';
import piano from './wv_piano.json';
import phonemeAh from './wv_phoneme_ah.json';
import phonemeO from './wv_phoneme_o.json';
import pulse from './wv_pulse.json';
import string from './wv_string.json';
import wurlitzer from './wv_wurlitzer.json';

class PeriodicWave {
  constructor({ real, imag }) {
    this.real = Float32Array.from(real);
    this.imaginary = Float32Array.from(imag);
  }
}

export default {
  acid: new PeriodicWave(acid),
  buzz: new PeriodicWave(buzz),
  piano: new PeriodicWave(piano),
  phonemeAh: new PeriodicWave(phonemeAh),
  phonemeO: new PeriodicWave(phonemeO),
  pulse: new PeriodicWave(pulse),
  string: new PeriodicWave(string),
  wurlitzer: new PeriodicWave(wurlitzer),
};
