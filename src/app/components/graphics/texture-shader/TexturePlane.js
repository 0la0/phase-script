import {
  FrontSide,
  IcosahedronGeometry,
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
  Vector3
} from 'three';

const SEGMENTS = 50;

export default class TexturePlane {
  constructor(vertexShader, fragmentShader) {
    const size = 100;
    const geometry = new PlaneGeometry(size, size, SEGMENTS, SEGMENTS);

    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
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
    // this.rate = 0.0002 * Math.random() + 0.00001;
  }

  getMesh() {
    return this.mesh;
  }

  update(elapsedTime, totalTime) {
    this.uniforms.time.value = totalTime;
  }
}
