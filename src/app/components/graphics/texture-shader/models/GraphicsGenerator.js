export const GenType = {
  SIN: 'SIN',
  SQU: 'SQU',
  SAW: 'SAW',
  TRI: 'TRI',
  NOISE: 'NOISE',
};

export default class GraphicsGenerator {
  constructor({ type, frequency, speed, amplitude, rotation, }) {
    this.type = type;
    this.frequency = frequency;
    this.speed = speed;
    this.amplitude = amplitude;
    this.rotation = rotation;
  }
}
