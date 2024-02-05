import * as THREE from  'three';
import Stats from '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        initDefaultSpotlight,
        onWindowResize, 
        lightFollowingCamera} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(10, 10, 10)); // Init camera in this position
var light = initDefaultSpotlight(scene, new THREE.Vector3(0, 0, 30)); // Use default light

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// Create the cube
let loader = new THREE.TextureLoader();
let geometry = new THREE.BoxGeometry(5, 5, 5);
let cubeMaterials = [
    setMaterial('../assets/textures/tiles.jpg', 1, 1),
    setMaterial('../assets/textures/tiles.jpg', 2, 2),
    setMaterial('../assets/textures/tiles.jpg', 3, 3),
    setMaterial('../assets/textures/tiles.jpg', 3, 1),
    setMaterial('../assets/textures/tiles.jpg', 6, 2),
    setMaterial('../assets/textures/tiles.jpg', 1, 3),
]

let cube = new THREE.Mesh(geometry, cubeMaterials);
cube.position.set(0, 2.5, 0)
scene.add(cube);


render();

// Function to set a texture
function setMaterial(file, i, j, color = 'rgb(255,255,255)'){
   let mat = new THREE.MeshBasicMaterial({ map: loader.load(file), color:color});
    let position = 0.33
   mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
   mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
   mat.map.repeat.set(0.325, 0.315); 
   mat.map.offset.set(position*j, position*i);
   return mat;
}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  lightFollowingCamera(light, camera) // Makes light follow the camera
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}