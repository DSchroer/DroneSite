import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Color,
  DefaultLoadingManager,
  AmbientLight,
  MOUSE,
  TOUCH,
  GridHelper,
  MathUtils,
  GammaEncoding,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadModel } from "./loader";
import { manifestValue } from "./manifest";
import { Vector } from "./vector";

let container: HTMLElement;
let camera: PerspectiveCamera;
let controls: OrbitControls;
let scene: Scene;
let renderer: WebGLRenderer;

const HEIGHT = 600;

function init(
  model: string,
  material: string,
  grid: boolean,
  rotate: Vector,
  translate: Vector,
  scale: Vector,
  light: number
) {
  container = document.createElement("div");
  document.getElementById("3dmodel")!.appendChild(container);

  camera = new PerspectiveCamera(45, container.clientWidth / HEIGHT, 1, 1000);
  camera.position.z = 35;
  camera.position.y = 35;

  scene = new Scene();
  scene.add(new AmbientLight(new Color("rgb(150,150,150)"), light));

  if (grid) {
    scene.add(new GridHelper(50, 10));
  }

  DefaultLoadingManager.onError = (err) =>
    console.error(`Filed to load ${err}`);
    
  loadModel(model, material, scene, rotate, translate, scale);

  renderer = new WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, HEIGHT);
  renderer.setClearColor(new Color("rgb(240, 248, 255)"));
  renderer.outputEncoding = GammaEncoding;
  renderer.gammaFactor = 2.2;
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.mouseButtons.LEFT = MOUSE.PAN;
  controls.mouseButtons.RIGHT = MOUSE.ROTATE;

  controls.touches.ONE = TOUCH.PAN;
  controls.touches.TWO = TOUCH.DOLLY_ROTATE;

  window.onresize = function () {
    camera.aspect = container.clientWidth / HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, HEIGHT);
  };
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}

(async () => {
  const res = await fetch("manifest.ini");
  const manifest = await res.text();

  const title = manifestValue(manifest, "title");
  const model = manifestValue(manifest, "model");
  const material = manifestValue(manifest, "material");
  const grid = manifestValue(manifest, "grid", (value) => value == "true");

  const pInt = (value: string) => Number.parseFloat(value || "0");
  const rotate = {
    X: manifestValue(manifest, "rotatex", pInt),
    Y: manifestValue(manifest, "rotatey", pInt),
    Z: manifestValue(manifest, "rotatez", pInt),
  };

  const translate = {
    X: manifestValue(manifest, "translatex", pInt),
    Y: manifestValue(manifest, "translatey", pInt),
    Z: manifestValue(manifest, "translatez", pInt),
  };

  const scale = {
    X: manifestValue(manifest, "scalex", pInt),
    Y: manifestValue(manifest, "scaley", pInt),
    Z: manifestValue(manifest, "scalez", pInt),
  };

  const light = manifestValue(manifest, "light", pInt);

  console.log(rotate);
  console.log(translate);
  console.log(scale);
  console.log(light);

  for (const el of document.getElementsByClassName("title")) {
    el.innerHTML = title;
  }

  init(model, material, grid, rotate, translate, scale, light);
  animate();
})();
