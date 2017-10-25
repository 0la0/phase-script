import {getPosNeg} from 'components/_util/math';
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

export {buildDefaultScene, getRandomVector};
