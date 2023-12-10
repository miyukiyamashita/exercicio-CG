import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let cubeGeometry = new THREE.BoxGeometry(11, 0.3, 6);
let cube = new THREE.Mesh(cubeGeometry, material);
// position the cube
cube.position.set(0.0, 3.0, 0.0);
// add the cube to the scene
scene.add(cube);


for (let i = 0; i < 4; i++){

    let position1 = [{'x': 5.0, 'y': -1.5, 'z': 2.0}, {'x': 5.0, 'y': -1.5, 'z':-2.0}, {'x':-5.0, 'y': -1.5, 'z': 2.0}, {'x':-5.0, 'y': -1.5, 'z': -2.0}];

    let cylinder = new THREE.CylinderGeometry(0.2,0.2,3,30);
    let material2 = new THREE.MeshBasicMaterial({color: 0xffff00});
    let  cylinder1 = new THREE.Mesh(cylinder, material2);

    cube.add(cylinder1);

    cylinder1.translateX(position1[i].x);
    cylinder1.translateY(position1[i].y);
    cylinder1.translateZ(position1[i].z);
}



// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}