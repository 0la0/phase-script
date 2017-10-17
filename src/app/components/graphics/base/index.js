import {
  PerspectiveCamera,
  Scene,
  Color
} from 'three';

function buildDefaultScene() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const widthHeightRatio = windowWidth / windowHeight;
  const camera = new PerspectiveCamera(65, widthHeightRatio, 1, 201);
  const scene = new Scene();
  camera.aspect = widthHeightRatio;
  scene.background = new Color(0x000000);
  scene.add(camera);
  return {camera, scene};
}

export {buildDefaultScene};
