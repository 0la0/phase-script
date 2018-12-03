import {getPosNeg} from 'services/Math';
import {
  PerspectiveCamera,
  Scene,
  Color,
  Vector3
} from 'three';

function buildDefaultScene(cameraFar) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const widthHeightRatio = windowWidth / windowHeight;
  const camera = new PerspectiveCamera(65, widthHeightRatio, 1, cameraFar || 201);
  const scene = new Scene();
  camera.aspect = widthHeightRatio;
  scene.background = new Color(0x000000);
  scene.add(camera);
  return {camera, scene};
}

function getRandomNumber(multiplier, canBeNegative) {
  return canBeNegative ?
    getPosNeg() * multiplier * Math.random() :
    multiplier * Math.random();
}

function getRandomVector(multiplier, canBeNegative) {
  return new Vector3(
    getRandomNumber(multiplier, canBeNegative),
    getRandomNumber(multiplier, canBeNegative),
    getRandomNumber(multiplier, canBeNegative)
  );
}

function lerpVectors(p1, p2, value) {
  const x = p1.x * value + p2.x * (1 - value);
  const y = p1.y * value + p2.y * (1 - value);
  const z = p1.z * value + p2.z * (1 - value);
  return new Vector3(x, y, z);
}

export {buildDefaultScene, getRandomVector, lerpVectors};
