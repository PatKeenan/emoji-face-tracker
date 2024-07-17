import * as THREE from "three";
import { loadDetector, loadWebCam } from "./face-detector";
import { initApp } from "./elements";
import "./style.css";

(async function app() {
  // State
  let showSquare = false;
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  // Elements & configuration
  const {
    app,
    video: VideoRoot,
    drawSquare,
    showSquareCheckbox,
    clearCanvas,
  } = initApp();
  // Load the detector and the webcam
  const detector = await loadDetector();
  const video = await loadWebCam(VideoRoot, {
    width: windowWidth,
    height: windowHeight,
  });

  // Event Listeners
  showSquareCheckbox.addEventListener("change", () => {
    showSquare = !showSquare;

    if (!showSquare) {
      clearCanvas();
    }
  });

  // Create a canvas to draw the face detection results
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    windowWidth / windowHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(windowWidth, windowHeight);

  renderer.setAnimationLoop(animate);
  app.prepend(renderer.domElement);

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

  //////////////////////////////////////////
  // Face Detection loop //////////////////
  async function runDetector() {
    let lastVideoTime = -1;
    async function loop() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = performance.now();
          const faces = await detector.estimateFaces(video, {
            flipHorizontal: true,
          });

          if (faces[0]) {
            // Draw the square if the checkbox is checked
            if (showSquare) {
              drawSquare(faces[0].box);
            }

            const { xMin, yMin, width, height } = faces[0].box;

            const x = xMin + width / 2;
            const y = yMin + height / 2;

            const xScaled = x / video.videoWidth;
            const yScaled = y / video.videoHeight;

            const xScreen = xScaled * windowWidth;
            const yScreen = yScaled * windowHeight;

            const targetX = (xScreen - windowWidth / 2) / 2500;
            const targetY = (yScreen - windowHeight / 2) / 2500;

            circle.rotation.y = targetX;
            circle.rotation.x = targetY;
          }
        }
      }
      requestAnimationFrame(loop);
    }
    setTimeout(() => {
      loop();
    }, 1000 / 30);
  }
  await runDetector();
  //////////////////////////////////////////
  // Threejs loop /////////////////////////
  async function animate() {
    renderer.render(scene, camera);
  }
})();
