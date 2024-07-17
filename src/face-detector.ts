import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as faceDetection from "@tensorflow-models/face-detection";

export async function loadWebCam(
  video: HTMLVideoElement,
  config: MediaTrackConstraints
): Promise<HTMLVideoElement> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      ...config,
    },
  });

  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
      video.play();
    };
  });
}

export function resizeResults(
  box: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    height: number;
    width: number;
  },
  video: HTMLVideoElement
) {
  const { xMin, xMax, yMin, yMax, height, width } = box;

  const { videoWidth, videoHeight } = video;

  const widthScale = videoWidth / video.videoWidth;
  const heightScale = videoHeight / video.videoHeight;

  const xMinScaled = xMin * widthScale;
  const xMaxScaled = xMax * widthScale;

  const yMinScaled = yMin * heightScale;
  const yMaxScaled = yMax * heightScale;

  return {
    xMin: xMinScaled,
    xMax: xMaxScaled,
    yMin: yMinScaled,
    yMax: yMaxScaled,
    width: width * widthScale,
    height: height * heightScale,
  };
}

export function loadDetector(): Promise<faceDetection.FaceDetector> {
  return new Promise((resolve, reject) => {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    faceDetection
      .createDetector(model, {
        maxFaces: 1,
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection",
      })
      .then((detector) => {
        resolve(detector);
      })
      .catch(reject);
  });
}
