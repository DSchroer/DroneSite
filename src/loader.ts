import { MathUtils, Scene } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { Vector } from "./vector";

export function loadModel(model: string, material: string, scene: Scene, rotate: Vector, translate: Vector, scale: Vector) {
  var mtlLoader = new MTLLoader();
  mtlLoader.load(material, function (
    materials
  ) {
    materials.preload();

    var objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(model, function (
      object
    ) {

      object.rotateX(rotate.X * MathUtils.DEG2RAD);
      object.rotateY(rotate.Y * MathUtils.DEG2RAD);
      object.rotateZ(rotate.Z * MathUtils.DEG2RAD);

      object.translateX(translate.X);
      object.translateY(translate.Y);
      object.translateZ(translate.Z);

      object.scale.set(scale.X, scale.Y, scale.Z);

      scene.add(object);
    });
  });
}
