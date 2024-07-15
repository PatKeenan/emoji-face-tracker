import "./style.css";
import * as THREE from "three";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Emoji
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffde34 });
const circle = new THREE.Mesh(geometry, material);
circle.position.z = 0;
scene.add(circle);

// Eyes Parts
const eyes = new THREE.Group();
const eyeGeometry = new THREE.SphereGeometry(0.2, 34, 34);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.position.x = -0.3;
leftEye.position.y = 0.2;
leftEye.position.z = 1;
eyes.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
rightEye.position.x = 0.3;
rightEye.position.y = 0.2;
rightEye.position.z = 1;
eyes.add(rightEye);

// Pupils
const pupils = new THREE.Group();
const pupilGeometry = new THREE.SphereGeometry(0.08, 32, 32);
const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
leftPupil.position.x = 0.3;
leftPupil.position.y = 0.18;
pupils.add(leftPupil);

const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
rightPupil.position.x = -0.3;
rightPupil.position.y = 0.18;
pupils.add(rightPupil);

pupils.position.z = 1.15;

// Emoji Parts and Scene
eyes.add(pupils);
circle.add(eyes);
camera.position.z = 5;

// Follow the mouse with the eyes until model is wired up
document.addEventListener("mousemove", (event) => {
  const x = event.clientX;
  const y = event.clientY;

  const targetX = (x - window.innerWidth / 2) / 1000;
  const targetY = (y - window.innerHeight / 2) / 1000;

  circle.rotation.y = targetX;
  circle.rotation.x = targetY;
});

function animate() {
  renderer.render(scene, camera);
}