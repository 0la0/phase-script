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
      cloudSpeed: { value: 1.2 },
      cloudFrequency: { value: 10, }
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
    // this.uniforms.cloudSpeed.value = 0.5 * Math.sin(totalTime) + 0.5;
  }
}
