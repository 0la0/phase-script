export default class PeriodicWave {
  constructor({ real, imag }) {
    this.real = Float32Array.from(real);
    this.imaginary = Float32Array.from(imag);
  }
}
