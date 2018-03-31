import {buildDefaultScene} from 'components/graphics/util';
import DisplacedSphere from './DisplacedSphere';
import {IntArray} from 'components/_util/math';
import {PointLight, Vector3} from 'three';

const perlinNoiseLib = require('./shaders/pnoise.vert');
const vertexShaderRoutine = require('./shaders/displace.vert');
const fragmentShader = require('./shaders/displace.frag');
const vertexShader = `${perlinNoiseLib}${vertexShaderRoutine}`;

const CENTER = new Vector3(0, 0, 0);
const CAMERA_SPEED = 0.3;
const CAMERA_RADIUS = 70;
const NUM_SPHERES = 1;

export default class DisplacedSpheres {

  constructor() {
    const defaultScene = buildDefaultScene();
    this.camera = defaultScene.camera;
    this.scene = defaultScene.scene;
    this.spheres = IntArray(NUM_SPHERES).map(index => new DisplacedSphere(vertexShader, fragmentShader));
    this.spheres.forEach(sphere => this.scene.add(sphere.getMesh()));

    // const light = new PointLight(0xff0000, 1, 100);
    // light.position.set(100, 100, 100);
    // this.scene.add(light);

    this.camera.position.set(0, 0, 200);
    this.totalTime = 0;
  }

  onTick(tick) {
    // if (tick.beatNumber % 8 === 0) {
    //   this.activateRandomSphere();
    // }
  }

  update(elapsedTime) {
    this.totalTime = this.totalTime + elapsedTime;
    this.spheres.forEach(sphere => sphere.update(elapsedTime, this.totalTime));
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  destroy() {
    // TODO
  }

  onClick() {
    // this.activateRandomSphere();
  }

  activateRandomSphere() {
    // const index = Math.floor(NUM_SPHERES * Math.random());
    // this.spheres[index].activate();
  }

  // TODO: just do this once in graphics manager?
  onResize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

}
