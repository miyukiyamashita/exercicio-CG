import * as THREE from 'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '../build/jsm/loaders/OBJLoader.js';
import { PLYLoader } from '../build/jsm/loaders/PLYLoader.js';
import { MTLLoader } from '../build/jsm/loaders/MTLLoader.js';
import {
   initRenderer,
   initDefaultBasicLight,
   createGroundPlane,
   SecondaryBox,
   onWindowResize,
   getMaxSize
} from "../libs/util/util.js";

let scene, renderer, camera, orbit, light;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 42)");
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2.18, 2, 3.31);
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.
orbit.target.set(0, .5, 0);
orbit.update();

light = initDefaultBasicLight(scene, true); // Use default light

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

let loadingMessage = new SecondaryBox("Loading...");

var groundPlane = createGroundPlane(7.0, 7.0, 100, 100); // width and height
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(3);
axesHelper.visible = false;
scene.add(axesHelper);

//---------------------------------------------------------
// Load external objects

// Assets manager --------------------------------
let assetManager = {
   // Properties ---------------------------------
   toontank: null,

   allLoaded: false,

   // Functions ----------------------------------
   checkLoaded: function () {
      if (!this.allLoaded) {
         if (this.toontank) {
            this.allLoaded = true;
            loadingMessage.hide();
         }
      }
   },

   hideAll: function () {
      this.toontank.visible = false;

   }
}

loadOBJFile('../assets/objects/', 'toontank', true, 1.5);


buildInterface();
render();



var loader = new GLTFLoader();
loader.load('..//assets/objects/toontank.glb', function (gltf) {
   console.log(gltf)
   scene.add(gltf.scene);

}, undefined, function (error) {

   console.error(error);

});



function loadOBJFile(modelPath, modelName, visibility, desiredScale) {
   var mtlLoader = new MTLLoader();
   mtlLoader.setPath(modelPath);
   mtlLoader.load(modelName + '.mtl', function (materials) {
      materials.preload();

      var objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(modelPath);
      objLoader.load(modelName + ".obj", function (obj) {
         obj.name = modelName;
         obj.visible = visibility;
         obj.traverse(function (child) {
            if (child.isMesh) child.castShadow = true;
            if (child.material) child.material.side = THREE.DoubleSide;
         });

         var obj = normalizeAndRescale(obj, desiredScale);
         var obj = fixPosition(obj);

         scene.add(obj);
         assetManager[modelName] = obj;
      });
   });

}

// Normalize scale and multiple by the newScale
function normalizeAndRescale(obj, newScale) {
   var scale = getMaxSize(obj);
   obj.scale.set(newScale * (1.0 / scale),
      newScale * (1.0 / scale),
      newScale * (1.0 / scale));
   return obj;
}

function fixPosition(obj) {
   // Fix position of the object over the ground plane
   var box = new THREE.Box3().setFromObject(obj);
   if (box.min.y > 0)
      obj.translateY(-box.min.y);
   else
      obj.translateY(-1 * box.min.y);
   return obj;
}

function buildInterface() {
   // Interface
   var controls = new function () {
      this.viewAxes = false;
      this.type = "toontank";
      this.onChooseObject = function () {
         assetManager.hideAll();
         assetManager[this.type].visible = true;
      };
      this.onViewAxes = function () {
         axesHelper.visible = this.viewAxes;
      };
   };

   // GUI interface
   var gui = new GUI();
   gui.add(controls, 'type',
      ['toontank'])
      .name("Change Object")
      .onChange(function (e) { controls.onChooseObject(); });
   gui.add(controls, 'viewAxes', false)
      .name("View Axes")
      .onChange(function (e) { controls.onViewAxes() });
}

function render() {
   assetManager.checkLoaded();
   requestAnimationFrame(render);
   renderer.render(scene, camera)
}