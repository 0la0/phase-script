import {
  FrontSide,
  PlaneGeometry,
  Mesh,
  ShaderMaterial
} from 'three';

const SEGMENTS = 200;
const SIZE = 50;

export default class TexturePlane {
  constructor(vertexShader, fragmentShader) {
    const geometry = new PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);

    this.uniforms = {
      time: { value: 0 },

      generator: { value: true, }, // osc vs noise
      generatorFrequency: { value: 10, },
      generatorSpeed: { value: 1.2, },
      generatorAmplitude: { value: 0.4, },
      generatorRotation: { value: 0, },

      modulator: { value: false, },
      modulatorFrequency: { value: 4, },
      modulatorSpeed: { value: 20, },
      modulatorAmplitude: { value: 1, },
      modulatorRotation: { value: 90, },
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
    this.uniforms.generatorFrequency.value = 0.5 * Math.sin(totalTime) + 2;
    this.uniforms.generatorRotation.value = totalTime * 10;
    this.uniforms.modulatorAmplitude.value = 3 * Math.sin(totalTime);
    this.uniforms.modulatorRotation.value = totalTime * -20;
  }
}
