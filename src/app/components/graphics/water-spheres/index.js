import {buildDefaultScene} from 'components/graphics/util';
import WaterSphere from './WaterSphere';
import {IntArray} from 'services/Math';
import {Vector3} from 'three';

const perlinNoiseLib = require('./shaders/pnoise.vert');
const vertexShaderRoutine = require('./shaders/displace.vert');
const fragmentShader = require('./shaders/displace.frag');
const vertexShader = `${perlinNoiseLib}${vertexShaderRoutine}`;

const CENTER = new Vector3(0, 0, 0);
const CAMERA_SPEED = 0.3;
const CAMERA_RADIUS = 70;
const NUM_SPHERES = 6;

export default class WaterSpheres {

  constructor() {
    const defaultScene = buildDefaultScene();
    this.camera = defaultScene.camera;
    this.scene = defaultScene.scene;
    this.spheres = IntArray(NUM_SPHERES).map(() => new WaterSphere(vertexShader, fragmentShader));
    this.spheres.forEach(sphere => this.scene.add(sphere.getMesh()));

    this.camPositionX = 0;
    this.camPositionY = 0;
    this.totalTime = 0;
  }

  onTick() {
    this.activateRandomSphere();
  }

  update(elapsedTime) {
    this.totalTime = this.totalTime + elapsedTime;
    this.spheres.forEach(sphere => sphere.update(elapsedTime, this.totalTime));

    this.camPositionX = CAMERA_RADIUS * Math.sin(this.totalTime * CAMERA_SPEED);
    this.camPositionZ = CAMERA_RADIUS * Math.cos(this.totalTime * CAMERA_SPEED);
    this.camera.position.set(this.camPositionX, 0, this.camPositionZ);
    this.camera.lookAt(CENTER);
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  destroy() {
    // TODO
  }

  onClick() {
    this.activateRandomSphere();
  }

  activateRandomSphere() {
    const index = Math.floor(NUM_SPHERES * Math.random());
    this.spheres[index].activate();
  }

  // TODO: just do this once in graphics manager?
  onResize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

}
