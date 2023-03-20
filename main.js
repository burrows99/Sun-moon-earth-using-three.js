import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();

const camera = getCamera();
const torus = getTorus();
const moon = getMoon();
const earth = getEarth(moon);
const sun = getSun(earth);
addMeteors(5000);

function getCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 30);
  return camera;
}

function getTorus() {
  const torusGeometry = new THREE.TorusGeometry(30, 3, 16, 100);
  const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
  const torus = new THREE.Mesh(torusGeometry, material);
  scene.add(torus);
  return torus;
}

function getEarth(moon) {
  const earthTexture = new THREE.TextureLoader().load('Images/Large_World_Physical_Map.png');
  const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(12, 50, 50), earthMaterial);
  scene.add(earth);
  earth.add(moon);
  earth.position.set(20,0,50)
  return earth;
}

function getMoon() {
  const moonTexture = new THREE.TextureLoader().load('Images/moon.jpg');
  const normalTexture = new THREE.TextureLoader().load('Images/normal.jpg');
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
  );
  moon.position.set(0, 0, 20);
  return moon;
}

function getSun(earth) {
  const light = new THREE.PointLight(0xffffff);
  const sunTexture = new THREE.TextureLoader().load('Images/sun.jpg');
  const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(20, 50, 50), sunMaterial);
  let x=0;
  let y=0;
  let z=0;
  sun.position.set(x, y, z);
  light.position.set(x, y, z);
  scene.add(light);
  scene.add(sun);
  sun.add(earth);
  return sun;
}

function addMeteors(n) {
  Array(n).fill().forEach(()=>{
    const geometry = new THREE.DodecahedronGeometry(1);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));
    star.position.set(x, y, z);
    scene.add(star);
  });
}


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const spaceTexture = new THREE.TextureLoader().load("Images/space.jpg");
scene.background = spaceTexture;

const gridHelper = new THREE.GridHelper(1000, 50);
scene.add(gridHelper);

const controls = getControls()
  
function getControls() {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = true;
  return controls;
}

function animate() {
  earth.rotation.y += 0.01;
  sun.rotation.y+=0.01;
  torus.rotation.x+=0.01;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
