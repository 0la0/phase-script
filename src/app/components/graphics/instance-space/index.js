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
} = THREE;

const TWO_PI = 2 * Math.PI;

function getRandPosition() {
  const mult = Math.random() < 0.5 ? 1 : -1;
  return mult * 100 * Math.random();
}

export default class InstanceSpace {
  constructor() {
    const { camera, scene } = buildDefaultScene();
    this.camera = camera;
    this.scene = scene;
    this.camera.position.set(0, 0, 100);

    this.numInstances = 10000;

    this.rotations = new Array(this.numInstances).fill(null)
      .map(() => ({
        rotationVelocity: new Vector3(Math.random() * TWO_PI, Math.random() * TWO_PI, Math.random() * TWO_PI),
        rotation: new Vector3(Math.random() * TWO_PI, Math.random() * TWO_PI, Math.random() * TWO_PI),
      }));

    const geometry = new BoxBufferGeometry(2,2,2,1,1,1);
    const material = new MeshLambertMaterial({ color: 0x006699 });

    const _v3 = new Vector3();
    const _q = new Quaternion(1, 0, 0, 1);

    this.cluster = new InstancedMesh(
      geometry,
      material,
      this.numInstances,
      true,  // dynamic
      false, // color
      true,  // uniform scale
    );

    for ( let i = 0 ; i < this.numInstances ; i ++ ) {
      this.cluster.setQuaternionAt(i , _q.setFromEuler(new Euler().setFromVector3(this.rotations[i].rotation, 'XYZ')));
      this.cluster.setPositionAt(i , _v3.set(getRandPosition(), getRandPosition(), getRandPosition()));
      this.cluster.setScaleAt(i , _v3.set(1, 1, 1) );
    }

    this.scene.add(this.cluster);

    const pointLight = new PointLight(0xFFFFFF, 1, 0, 0);
    pointLight.position.set(0, 0, 0);

    const ambientLight = new PointLight(0xFFFFFF, 2);

    this.scene.add(pointLight);
    this.scene.add(ambientLight);
  }

  onTick() {
    // this.geoContainer.reset();
  }

  onClick() {
    // this.geoContainer.reset();
  }

  update(elapsedTime) {

    // currentMesh.setQuaternionAt( i , o.quaternion.setFromEuler( o.rotation ) );

    // this.geoContainer.update(elapsedTime);

    for ( let i = 0 ; i < this.numInstances ; i ++ ) {
      // cluster.setQuaternionAt(i , _q );

      const rotation = this.rotations[i];
      rotation.rotation.add(rotation.rotationVelocity.clone().multiplyScalar(elapsedTime * 0.1));
      // const updatedRotation = rotation;
      // rotation.add(rDelta);

      // const instance = this.cluster[i];
      const quat = this.cluster.getQuaternionAt(i);

      this.cluster.setQuaternionAt(i, quat.setFromEuler(new Euler().setFromVector3(rotation.rotation, 'XYZ')));

      // currentMesh.needsUpdate( 'quaternion' );
      // this.cluster.setQuaternionAt(i , _q.setFromEuler(rotations[i]));
      // this.cluster.setPositionAt(i , _v3.set(getRandPosition(), getRandPosition(), getRandPosition()));
      // this.cluster.setScaleAt(i , _v3.set(1, 1, 1) );
    }
    this.cluster.needsUpdate( 'quaternion' );
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
