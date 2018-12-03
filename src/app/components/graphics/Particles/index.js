import {buildDefaultScene} from 'components/graphics/util';
import {getPosNeg, IntArray} from 'services/Math';
import Particle from './Particle';
import {
  Geometry,
  PointsMaterial,
  Points,
  Vector3
} from 'three';

function getJitter(magnitude) {
  return getPosNeg() * magnitude * Math.random();
}

function getPointInSpace() {
  return new Vector3(
    -50 + 100 * Math.random(),
    25 +  50 * Math.random(),
    -100 + 50 * Math.random(),
  );
}

function getTTL() {
  return 0.4 + 0.4 * Math.random();
}

function getRandomVelocity() {
  return new Vector3(
    getJitter(10),
    -100 + -50 * Math.random(),
    getJitter(10)
  );
}

class SeedLine {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  getRandomPointOnLine() {
    return this.p1.clone()
      .lerp(this.p2, Math.random())
      .add(new Vector3(getJitter(1), getJitter(1), getJitter(1)));
  }
}

export default class Particles {

  constructor() {
    const defaultScene = buildDefaultScene();
    this.camera = defaultScene.camera;
    this.scene = defaultScene.scene;

    const particleCount = 3000;
    const particleGeometry = new Geometry();
    const particleMaterial = new PointsMaterial({
      color: 0xFFFFFF,
      size: 0.3,
      // transparent: true
    });

    this.seedLine = new SeedLine(getPointInSpace(), getPointInSpace());

    this.particles = IntArray(particleCount).map(() => new Particle(
      this.seedLine.getRandomPointOnLine(),
      getRandomVelocity(),
      getTTL()
    ));
    this.particles.forEach(particle => particleGeometry.vertices.push(particle.getPosition()));
    this.particleSystem = new Points(particleGeometry, particleMaterial);
    this.scene.add(this.particleSystem);
  }

  update(elapsedTime) {
    this.particles.forEach(particle => {
      particle.update(elapsedTime);
      if (particle.isExpired()) {
        particle.reset(this.seedLine.getRandomPointOnLine(), getTTL());
      }
    });
    this.particleSystem.geometry.verticesNeedUpdate = true;
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  reset() {
    this.seedLine = new SeedLine(getPointInSpace(), getPointInSpace());
  }

  destroy() {
    // TODO
  }

  onClick() {
    this.reset();
  }

  onTick() {
    this.reset();
  }

  // TODO: just do this once in graphics manager?
  onResize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

}
