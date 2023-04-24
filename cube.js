"use strict";

import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RGBELoader} from './RGBELoader.js'; 


function main() {
    // Get the canvas element
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Synthetic Camera Settings
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 10;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 4;
    //camera.position.x = 2;
    //camera.position.y = 2;

    // Object Material
    //const material = new THREE.MeshPhongMaterial({color: 0x44aa88});
    const refractionMaterial = new THREE.MeshPhysicalMaterial({
        roughness: 0,
        transmission: 1,
        thickness: 5
    });

    const cubeMat = {
        clearcoat: 1,
        metalness: 0.9,
        roughness: 0.1,
        color: 0xFF2D00
    };

    const reflectionMaterial =  new THREE.MeshPhysicalMaterial(cubeMat);

    const diffuseMaterial = new THREE.MeshPhongMaterial({color: 0x0059FF}); 

    // Model Geometry Cube
    const scene = new THREE.Scene();
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const cube = new THREE.Mesh(geometry, reflectionMaterial);
    scene.add(cube);

    // Model Geometry Sphere
    // radius, width subdivisions, height subdivisions
    const geometrySphere = new THREE.SphereGeometry( 0.5, 32, 16 );
    const sphere = new THREE.Mesh( geometrySphere, refractionMaterial );
    sphere.position.x = 2;
    scene.add( sphere );

    // Model Geometry Tetrahedron
    const tetrahedronGeo = new THREE.TetrahedronGeometry( 1, 0 );
    const tetrahedron = new THREE.Mesh( tetrahedronGeo, diffuseMaterial );
    tetrahedron.position.x = -2;
    scene.add( tetrahedron );
    

    // Lighting Settings

    // Directional Light
    const pointcolor = 0xFFFFFF;     // white light
    const pointintensity = 0.1;        // starting intensity
    const pointlight = new THREE.DirectionalLight(pointcolor, pointintensity);
    pointlight.position.set(-1, 2, 4);  // Position of the light (x, y , z) "behind the camera"
    scene.add(pointlight);

    // Ambient Light
    const ambientcolor = 0xFFFFFF;     // white light
    const ambientintensity = 0.1;        // starting intensity
    const ambientlight = new THREE.AmbientLight(ambientcolor, ambientintensity); // soft white light
    scene.add( ambientlight );




    // Add an outline to the cube with edges geometry
    //var geo = new THREE.EdgesGeometry( cube.geometry );
    //var mat = new THREE.LineBasicMaterial( { color: 0x000000 } );
    //var wireframe = new THREE.LineSegments( geo, mat );
    //cube.add( wireframe );


    // Set a background image to the scene instead of a black environment
    // renderer adjustments
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 4;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Loading the HDRI image to the scene background
    new RGBELoader()
        .load("./paris8k.hdr", function (texture){
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
        });


    // Call the render function inputting the scene and the camera.
    renderer.render(scene, camera);



    // Controls
    const controls = new OrbitControls( camera, renderer.domElement );


    // Define an animation loop inside this function
    function render(time) {
        time *= 0.001;  // convert time to seconds
       
        cube.rotation.x = time;
        cube.rotation.y = time;

        tetrahedron.rotation.x = time;
        tetrahedron.rotation.y = time;

        sphere.rotation.x = time;
        sphere.rotation.y = time;
       
        renderer.render(scene, camera);
        controls.update();
        requestAnimationFrame(render);
    }

    // animation loop
    requestAnimationFrame(render);
}





main();