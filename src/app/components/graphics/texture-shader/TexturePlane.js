import {
  FrontSide,
  PlaneGeometry,
  Mesh,
  ShaderMaterial
} from 'three';

const SEGMENTS = 200;
const SIZE = 50;

const GEN_TYPE = {
  NOISE: 0,
  OSC_SIN: 1,
  OSC_SQU: 2,
  OSC_SAW: 3,
  OSC_TRI: 4,
};

export default class TexturePlane {
  constructor(vertexShader, fragmentShader) {
    const geometry = new PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);

    this.uniforms = {
      time: { value: 0 },

      generatorType: { value: GEN_TYPE.OSC_SIN, },
      generatorFrequency: { value: 3, },
      generatorSpeed: { value: 2, },
      generatorAmplitude: { value: 1, },
      generatorRotation: { value: 0, },

      modulatorType: { value: GEN_TYPE.NOISE, },
      modulatorFrequency: { value: 2, },
      modulatorSpeed: { value: 10, },
      modulatorAmplitude: { value: 2, },
      modulatorRotation: { value: 45, },
    };

    const material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      side: FrontSide,
    });
    this.mesh = new Mesh(geometry, material);
    this.startTime = performance.now();
    this.isActive = false;
  }

  getMesh() {
    return this.mesh;
  }

  update(elapsedTime, totalTime) {
    this.uniforms.time.value = totalTime;
    // this.uniforms.generatorAmplitude.value = 3 + 0.5 * Math.sin(0.25 * totalTime);
    // this.uniforms.generatorSpeed.value = 4 * (0.5 * Math.sin(totalTime) + 1);
    this.uniforms.generatorRotation.value = totalTime * 20;
    this.uniforms.modulatorFrequency.value = 10 + 4 * Math.sin(totalTime * 0.5);
    // this.uniforms.modulatorSpeed.value = 9 + 3 * Math.sin(totalTime * 2);
    this.uniforms.modulatorRotation.value = totalTime * -10;
  }
}
