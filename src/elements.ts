import type { Face } from "@tensorflow-models/face-detection";
import { domUtils } from "./dom-utils";

const { createElement, setAttributes, setInnerText, appendChild, appendToDom } =
  domUtils;

// Elements
const video = createElement("video");
const container = setAttributes(createElement("div"), {
  id: "container",
});
const showSquareGroup = setAttributes(createElement("div"), {
  id: "show-square-group",
});

const showSquareLabel = setAttributes(
  setInnerText(createElement("label"), "Show Tracking Square"),
  {
    for: "show-square",
  }
);

const showSquareCheckbox = setAttributes(createElement("input"), {
  type: "checkbox",
  id: "show-square",
});

const footer = setAttributes(createElement("footer"), {
  id: "footer",
});

const footerLink = createElement("a");
setAttributes(footerLink, {
  href: "https://github.com/PatKeenan/emoji-face-tracker",
});
setAttributes(setInnerText(footerLink, "Created by Pat Keenan"), {
  target: "_blank",
});

appendChild(footer, footerLink);

appendChild(
  container,
  appendChild(showSquareGroup, showSquareLabel, showSquareCheckbox)
);

const canvas = createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "100";
canvas.style.pointerEvents = "none";

const ctx = canvas.getContext("2d");

function drawSquare(results: Face["box"]) {
  if (!ctx) {
    throw new Error("No context found");
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.rect(results.xMin, results.yMin, results.width, results.height);
  ctx.stroke();
}

// clear the canvas
function clearCanvas() {
  if (!ctx) {
    throw new Error("No context found");
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function initApp() {
  const app = document.getElementById("app");
  if (!app || !video) {
    throw new Error("No shadow root found");
  }
  appendToDom(app, video, container, canvas, footer);

  return {
    video: video as HTMLVideoElement,
    app,
    drawSquare,
    showSquareCheckbox,
    clearCanvas,
    canvas,
    footer,
  };
}
