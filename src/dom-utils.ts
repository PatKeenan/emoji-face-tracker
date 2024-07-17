// Helpers
function createElement<T extends keyof HTMLElementTagNameMap>(
  e: T
): HTMLElementTagNameMap[T] {
  return document.createElement(e);
}
function appendChild(parent: HTMLElement, ...children: HTMLElement[]) {
  children.forEach((child) => parent.appendChild(child));
  return parent;
}

function appendToDom(domRoot: HTMLElement, ...elements: HTMLElement[]) {
  elements.forEach((element) => domRoot.appendChild(element));
}

function setInnerText(element: HTMLElement, text: string) {
  element.innerText = text;
  return element;
}

function setAttributes<T extends keyof HTMLElementTagNameMap>(
  element: HTMLElementTagNameMap[T],
  attributes: Partial<HTMLElementTagNameMap[T]>
) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key] as typeof key);
  }
  return element;
}

export const domUtils = {
  createElement,
  appendChild,
  appendToDom,
  setInnerText,
  setAttributes,
};
