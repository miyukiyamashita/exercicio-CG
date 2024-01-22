import * as THREE from 'three';
import GUI from '../libs/util/dat.gui.module.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { TeapotGeometry } from '../build/jsm/geometries/TeapotGeometry.js';
import {
  initRenderer,
  createGroundPlane,
  onWindowResize,
  createLightSphere,
} from '../libs/util/util.js';

let scene, renderer, camera, orbit, keyboard; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer("rgb(30, 30, 42)");    // View function in util/utils
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(2.18, 1.62, 3.31);
camera.up.set(0, 1, 0);
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// To use the keyboard
keyboard = new KeyboardState();

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

let groundPlane = createGroundPlane(4.0, 4.0, 50, 50); // width and height
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(1.5);
axesHelper.visible = false;
scene.add(axesHelper);

// Teapot
let objColor = "rgb(255,255,255)"; // Define the color of the object
let objShininess = 200;          // Define the shininess of the object

let geometry = new TeapotGeometry(0.5);
let material = new THREE.MeshPhongMaterial({ color: objColor, shininess: objShininess });
material.side = THREE.DoubleSide;
let obj = new THREE.Mesh(geometry, material);
obj.castShadow = true;
obj.position.set(0.0, 0.5, 0.0);
scene.add(obj);
// 
const torusGeometry = new THREE.TorusGeometry(1.5, 0.03, 6, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: "rgb(255,255,255)" });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);
torus.rotateX(THREE.MathUtils.degToRad(90));
torus.position.set(0.0, 1.4, 0.0)

//---------------------------------------------------------

let ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);
ambientLight.intensity = 0.08;

let lightPosition = [new THREE.Vector3(Math.cos(1) * 1.5, 1.4, Math.sin(1) * 1.5), new THREE.Vector3(Math.cos(2) * 1.5, 1.4, Math.sin(2) * 1.5), new THREE.Vector3(Math.cos(3) * 1.5, 1.4, Math.sin(3) * 1.5)];
let lightColor = ["rgb(255,0,0)", "rgb(0,255,0)", "rgb(0,0,255)"];

// Sphere to represent the light
let lightSphere1 = createLightSphere(scene, 0.05, 10, 10, lightPosition[0]);
let lightSphere2 = createLightSphere(scene, 0.05, 10, 10, lightPosition[1]);
let lightSphere3 = createLightSphere(scene, 0.05, 10, 10, lightPosition[2]);

let spotLight1 = new THREE.SpotLight(lightColor[0]);
let spotLight2 = new THREE.SpotLight(lightColor[1]);
let spotLight3 = new THREE.SpotLight(lightColor[2]);

setSpotLight(new THREE.Vector3(Math.cos(1) * 1.5, 1.4, Math.sin(1) * 1.5), spotLight1);
setSpotLight(new THREE.Vector3(Math.cos(2) * 1.5, 1.4, Math.sin(2) * 1.5), spotLight2);
setSpotLight(new THREE.Vector3(Math.cos(3) * 1.5, 1.4, Math.sin(3) * 1.5), spotLight3);


// Hide all lights and make only the spotLight visible
spotLight1.visible = true;
spotLight2.visible = true;
spotLight3.visible = true;

buildInterface();
render();

// Set Spotlight
// More info here: https://threejs.org/docs/#api/en/lights/SpotLight
function setSpotLight(position, spot) {
  spot.position.copy(position);
  spot.angle = THREE.MathUtils.degToRad(40);
  spot.decay = 2; // The amount the light dims along the distance of the light.
  spot.penumbra = 1; // Percent of the spotlight cone that is attenuated due to penumbra. 

  // Shadow settings
  spot.castShadow = true;
  spot.shadow.mapSize.width = 512;
  spot.shadow.mapSize.height = 512;
  spot.name = "Spot Light"

  scene.add(spot);
}

// Update light position of the current light
function updateLightPosition() {
  spotLight1.position.copy(lightPosition[0]);
  lightSphere1.position.copy(lightPosition[0]);
  spotLight2.position.copy(lightPosition[1]);
  lightSphere2.position.copy(lightPosition[1]);
  spotLight3.position.copy(lightPosition[2]);
  lightSphere3.position.copy(lightPosition[2]);

}



function buildInterface() {
  //------------------------------------------------------------
  // Interface
  let controls = new function () {
    this.viewAxes = false;
    this.red = true;
    this.green = true;
    this.blue = true;



    this.onViewAxes = function () {
      axesHelper.visible = this.viewAxes;
    };

    this.turnRedLight = () => {
      spotLight1.intensity = spotLight1.intensity == 1 ? 0 : 1;
    }
    this.turnGreenLight = () => {
      spotLight2.intensity = spotLight2.intensity == 1 ? 0 : 1;
    }
    this.turnBlueLight = () => {
      spotLight3.intensity = spotLight3.intensity == 1 ? 0 : 1;
    }


  };



  let gui = new GUI();
  gui.add(controls, 'viewAxes', false)
    .name("View Axes")
    .onChange(function (e) { controls.onViewAxes() });
  gui.add(controls, 'red', true)
    .name("Red Light")
    .onChange(function (e) { controls.turnRedLight() });
  gui.add(controls, 'green', true)
    .name("Green Light")
    .onChange(function (e) { controls.turnGreenLight() });
  gui.add(controls, 'blue', true)
    .name("Blue Light")
    .onChange(function (e) { controls.turnBlueLight() });

}


var angle1 = 1;
var angle2 = 2;
var angle3 = 3;
var speed = 0.005;

function keyboardUpdate() {
  keyboard.update();

  if (keyboard.pressed('right')) {
    angle1 += speed;
    const x = 1.5 * Math.cos(angle1);
    const z = 1.5 * Math.sin(angle1);
    lightPosition[0].set(x, 1.4, z)
    updateLightPosition();
  }
  if (keyboard.pressed('left')) {
    angle1 -= speed;
    const x = 1.5 * Math.cos(angle1);
    const z = 1.5 * Math.sin(angle1);
    lightPosition[0].set(x, 1.4, z)
    updateLightPosition();
  }

  if (keyboard.pressed('e')) {
    angle2 += speed;
    const x = 1.5 * Math.cos(angle2);
    const z = 1.5 * Math.sin(angle2);
    lightPosition[1].set(x, 1.4, z)
    updateLightPosition();
  }
  if (keyboard.pressed('q')) {
    angle2 -= speed;
    const x = 1.5 * Math.cos(angle2);
    const z = 1.5 * Math.sin(angle2);
    lightPosition[1].set(x, 1.4, z)
    updateLightPosition();
  }

  if (keyboard.pressed('a')) {
    angle3 += speed;
    const x = 1.5 * Math.cos(angle3);
    const z = 1.5 * Math.sin(angle3);
    lightPosition[2].set(x, 1.4, z)
    updateLightPosition();
  }
  if (keyboard.pressed('d')) {
    angle3 -= speed;
    const x = 1.5 * Math.cos(angle3);
    const z = 1.5 * Math.sin(angle3);
    lightPosition[2].set(x, 1.4, z)
    updateLightPosition();
  }

}


function render() {
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}