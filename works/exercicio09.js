import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import GUI from '../libs/util/dat.gui.module.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 20, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(15);
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(30, 30)
scene.add(plane);


  let sphereGeometry = new THREE.SphereGeometry(2, 17, 45);
  let material3 = new THREE.MeshBasicMaterial({ color: 0x9400d3 });
  let sphere = new THREE.Mesh(sphereGeometry, material3);
  let sphere2 = new THREE.Mesh(sphereGeometry, material3);
  sphere.position.set(-5,2.5,-5);
  sphere2.position.set(-5.0,2.5,5);
 
  scene.add(sphere);
  scene.add(sphere2);

 const lerpConfig = {
  destination1: new THREE.Vector3(5, 2.5, -5),
  destination2: new THREE.Vector3(5, 2.5, 5),
  alpha1: 0.05,
  alpha2: 0.02,
  move1: false,
  move2: false
 }

 const reset = () => {
  lerpConfig.destination1 = {x: -5, y: 2.5, z: -5};
  lerpConfig.destination2 = {x: -5, y: 2.5, z: 5};
  
 }


document.getElementById('btnSphere1').addEventListener('click', () => {
  lerpConfig.destination1 = {x: 5, y: 2.5, z: -5};
  lerpConfig.move1 = true;
})
document.getElementById('btnSphere2').addEventListener('click', () => {
  lerpConfig.destination2 = {x: 5, y: 2.5, z: 5};
  lerpConfig.move2 = true;
})
document.getElementById('btnReset').addEventListener('click', () => {
  
  reset()

})

render();
function render()
{

  lerpConfig.move1 ? sphere.position.lerp(lerpConfig.destination1,lerpConfig.alpha1) : 0;
  lerpConfig.move2 ? sphere2.position.lerp(lerpConfig.destination2,lerpConfig.alpha2) : 0;
  
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}