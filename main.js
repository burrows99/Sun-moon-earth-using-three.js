import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.TorusGeometry(30, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);


const earthTexture = new THREE.TextureLoader().load('Images/Large_World_Physical_Map.png');
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(new THREE.SphereGeometry(12, 50, 50), earthMaterial);
scene.add(earth);


const moonTexture = new THREE.TextureLoader().load('Images/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('Images/normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);
earth.add(moon);
moon.position.set(0, 0, 20);

const light = new THREE.PointLight(0xffffff);
const sunTexture = new THREE.TextureLoader().load('Images/sun.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(new THREE.SphereGeometry(10, 50, 50), sunMaterial);
let x=30;
let y=0;
let z=50;
sun.position.set(x, y, z);
light.position.set(x, y, z);
scene.add(light);
scene.add(sun);

const spaceTexture = new THREE.TextureLoader().load("Images/space.jpg");
scene.background = spaceTexture;

const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;

function addStar() {
  const geometry = new THREE.SphereGeometry(0.125);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(1000).fill().forEach(addStar);

const earthOrbit = new THREE.Object3D();
earthOrbit.position.set(0, 0, 0);
scene.add(earthOrbit);
earthOrbit.add(earth);

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.01;
  torus.rotation.x+=0.01;
  earthOrbit.rotation.y += 0.01;
  // moon.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();
