import {
  // BackSide,
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
      displaceList: {
        type: 'fv1',
        value: [0.1, 0.2, 0.3, 0.7, 0.8]
      }
    };

    const material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      // side: BackSide,
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
    const deltaTime = performance.now() - this.startTime;
    // this.uniforms.time.value = this.rate * totalTime * 1000;

    if (!this.isActive) { return; }

    this.mesh.position.add(
      this.goalPosition.clone()
        .sub(this.mesh.position.clone())
        .multiplyScalar(30 * Math.random() * elapsedTime)
    );
    this.isActive = this.goalPosition.distanceTo(this.mesh.position) > 0.01;
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
