import {
  FrontSide,
  IcosahedronGeometry,
  Mesh,
  ShaderMaterial,
  Vector3
} from 'three';
import {getPosNeg} from 'components/_util/math';

const goalRange = 4;

export default class DisplacedSphere {

  constructor(vertexShader, fragmentShader) {
    const size = 25 + Math.floor(10 * Math.random());
    const geometry = new IcosahedronGeometry(size, 4);

    this.uniforms = {
      time: {
        type: 'f',
        value: Math.random()
      },
      magnitude: {
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
    this.goalPosition = new Vector3(0, 0, 0);
    this.startTime = performance.now();
    this.isActive = false;
    this.rate = 0.0002 * Math.random() + 0.00001;
  }

  getMesh() {
    return this.mesh;
  }

  update(elapsedTime, totalTime) {
    this.uniforms.time.value = this.rate * totalTime * 1000;
    this.uniforms.magnitude.value = 2 * Math.abs(Math.sin(totalTime));
  }

  activate() {
    this.goalPosition = new Vector3(
      goalRange * getPosNeg() * Math.random(),
      goalRange * getPosNeg() * Math.random(),
      goalRange * getPosNeg() * Math.random()
    );
    this.isActive = true;
  }

}
