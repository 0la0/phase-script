import * as THREE from 'three';
import InstanceMeshModule from 'three-instanced-mesh';
import { buildDefaultScene } from 'components/graphics/util';

const InstancedMesh = InstanceMeshModule( THREE );
const {
  BoxBufferGeometry,
  MeshLambertMaterial,
  PointLight,
  Vector3,
  Euler,
  Quaternion,
  Spherical,
} = THREE;

/**
 *  box().repeat(10, 10, 3).rotate(1, 1, 0).scale(1, 1, 1)
*/

const vars = {
  repeatX: 30,
  strideX: 1,
  rotateX: 0.2,
  rotateVelocityX: 2,
  positionVelocityX: 1,
  repeatY: 30,
  strideY: 1.5,
  rotateY: 2,
  rotateVelocityY: 10,
  positionVelocityY: 20,
  repeatZ: 3,
  strideZ: 10,
  rotateZ: 1.3,
  rotateVelocityZ: 2,
  positionVelocityZ: 0.01,
  sizeX: 1,
  sizeY: 0.2,
  sizeZ: 0.5,
};

const getPosNeg = () => Math.random() < 0.5 ? -1 : 1;

function jitter(magnitude = 1) {
  return getPosNeg() * magnitude * Math.random();
}

class GeoProperties {
  constructor() {
    this.position = new Vector3();
    this.positionVelocity = new Vector3();
    this.rotation = new Vector3(),
    this.rotationVelocity = new Vector3(),
    this.scale = new Vector3();
  }
}

export default class InstanceSpace {
  constructor() {
    const { camera, scene } = buildDefaultScene();
    this.camera = camera;
    this.scene = scene;
    this.camera.position.set(0, 0, 35);
    this.numInstances = vars.repeatX * vars.repeatY * vars.repeatZ;
    this.geoProperties = new Array(this.numInstances).fill(null).map(_ => new GeoProperties());

    const geometry = new BoxBufferGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({ color: 0x006699, side: THREE.FrontSide });

    this.cluster = new InstancedMesh(
      geometry,
      material,
      this.numInstances,
      true,  // dynamic
      false, // color
      true,  // uniform scale
    );

    
    this.scene.add(this.cluster);

    const pointLight = new PointLight(0xFFFFFF, 1, 0, 0);
    pointLight.position.set(0, 0, 0);

    const ambientLight = new PointLight(0xFFFFFF, 2);
    ambientLight.position.set(0, 0, 100);
    this.scene.add(pointLight);
    this.scene.add(ambientLight);

    this._reset();
  }

  _reset() {
    const _q = new Quaternion(1, 0, 0, 1);

    const halfX = (vars.repeatX * vars.strideX) / 2;
    const halfY = (vars.repeatY * vars.strideY) / 2;
    const halfZ = (vars.repeatZ * vars.strideZ) / 2;

    this.geoProperties.forEach((geoProperty, index) => {
      const z = index % vars.repeatZ;
      const y = Math.floor(index / vars.repeatZ) % vars.repeatY;
      const x = Math.floor(index / (vars.repeatY * vars.repeatZ)) % vars.repeatX;
      const posX = x * vars.strideX - halfX;
      const posY = y * vars.strideY - halfY;
      const posZ = z * vars.strideZ - halfZ;
      geoProperty.position = new Vector3(posX, posY, posZ);
      geoProperty.positionVelocity = new Vector3(vars.positionVelocityX, vars.positionVelocityY, vars.positionVelocityZ);
      geoProperty.rotation = new Vector3(vars.rotateX, vars.rotateY, vars.rotateZ);
      geoProperty.rotationVelocity = new Vector3(vars.rotateVelocityX, vars.rotateVelocityY, vars.rotateVelocityZ);
      geoProperty.scale = new Vector3(vars.sizeX, vars.sizeY, vars.sizeZ);
    });

    this.geoProperties.forEach((geoProperty, index) => {
      this.cluster.setQuaternionAt(index , _q.setFromEuler(new Euler().setFromVector3(geoProperty.rotation, 'XYZ')));
      this.cluster.setPositionAt(index , geoProperty.position);
      this.cluster.setScaleAt(index , geoProperty.scale);
    });
  }

  onTick() {
    // this.geoContainer.reset();
  }

  onClick() {
    this._reset();
  }

  update(elapsedTime) {
    this.geoProperties.forEach((geoProperty, index) => {
      const quat = this.cluster.getQuaternionAt(index);
      geoProperty.rotation.add(geoProperty.rotationVelocity.clone().multiplyScalar(elapsedTime * 0.1));
      this.cluster.setQuaternionAt(index, quat.setFromEuler(new Euler().setFromVector3(geoProperty.rotation, 'XYZ')));
      // this.cluster.setPositionAt(index, geoProperty.position.add(geoProperty.positionVelocity.clone().multiplyScalar(elapsedTime * 0.1)));
    });
    this.cluster.needsUpdate('quaternion');
    // this.cluster.needsUpdate('position');
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  destroy() {
    // TODO
  }

  onResize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}
