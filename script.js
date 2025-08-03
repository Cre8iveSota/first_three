import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";

// Create a GUI
const gui = new GUI({
  width: 300,
  title: "Three.js Debugging",
  closeFolders: false,
});
// gui.close();
// gui.hide();

window.addEventListener("keydown", (event) => {
  if (event.key == "h") {
    if (gui._closed) {
      gui.show();
    } else {
      gui.hide();
    }
  }
});

const debugObject = {};

// Createb a canvas element
const canvas = document.querySelector("canvas.webgl");

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

gui.add(camera.position, "x", -10, 10, 0.01).name("Camera X");
gui.add(camera.position, "y", -10, 10, 0.01).name("Camera Y");
gui.add(camera.position, "z", -10, 10, 0.01).name("Camera Z");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Handle fullscreen toggle on double click
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

// Create a renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Create a Object
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

const geometry = new THREE.BufferGeometry();
const count = 200;
const positionsArray = new Float32Array(count * 3); // 3 values per vertex (x, y, z)

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 4; // Random values between -0.5 and 0.5
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3); // 3 values per vertex (x, y, z)

// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]); // x y z,  x y z, x y z

// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3); // meaning 1 vertex has 3 values (x, y, z

// const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", positionsAttribute); // position is meaning the shader will use this attribute to render the object

const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);
const cubeTweaks = gui.addFolder("Cube Tweaks");
scene.add(cube);

cubeTweaks.add(cube, "visible").name("Toggle Cube Visibility");
cubeTweaks.add(material, "wireframe").name("Toggle Wireframe");
cubeTweaks.addColor(material, "color").name("Cube Color");

debugObject.spin = () => {
  gsap.to(cube.rotation, {
    duration: 1,
    y: cube.rotation.y + Math.PI * 2,
    ease: "power1.inOut",
  });
};

cubeTweaks.add(debugObject, "spin").name("Spin Cube");

debugObject.subdivision = 2;
cubeTweaks
  .add(debugObject, "subdivision", 0, 5, 1)
  .name("Subdivision")
  .onFinishChange((value) => {
    cube.geometry.dispose(); // Dispose of the old geometry
    cube = new THREE.BoxGeometry(1, 1, 1, value, value, value);
    cube.setAttribute("position", positionsAttribute);
    cube.geometry.dispose(); // Dispose of the old geometry
    cube.geometry = newGeometry; // Assign the new geometry
  });

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

console.log(THREE);
