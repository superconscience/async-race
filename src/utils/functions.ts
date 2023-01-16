import { v4 as uuid } from 'uuid';
import { Car } from '../types';
import { DatasetHelper } from './types';
import { CAR_BRANDS, CAR_MODELS, MAX_HEX } from '../constants';

export const capitalize = (value: string) => value.slice(0, 1).toUpperCase() + value.slice(1);

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
): HTMLElementTagNameMap[K] => {
  const $element = document.createElement(tagName);
  if (className) {
    $element.className = className;
  }
  return $element;
};

export const $ = createElement;

export const bem = (
  block: string,
): {
    element: (elemClass: string, mod?: string) => string;
    block: string;
  } => ({
  element: (elemClass: string, mod?: string) => {
    const m = mod ? `_${mod}` : '';
    const className = `${block}__${elemClass}${m}`;
    return className;
  },
  block,
});

export const generateId = () => uuid();

export const createCar = (name: string, color: string): Car => ({
  id: generateId(),
  name,
  color,
});

export const generateCarName = () => {
  const brandIndex = Math.floor(Math.random() * CAR_BRANDS.length);
  const modelIndex = Math.floor(Math.random() * CAR_MODELS.length);
  return `${CAR_BRANDS[brandIndex]} ${CAR_MODELS[modelIndex]}`;
};

export const generateColor = () => `#${Math.floor(Math.random() * MAX_HEX).toString(16)}`;

export const datasetHelper = (): DatasetHelper => ({
  set: <Dataset extends DOMStringMap>(
    $element: HTMLElement,
    dataset: Dataset,
  ): void => {
    Object.entries(dataset).forEach(([key, value]) => {
      $element.dataset[key] = value;
    });
  },
  get: <Dataset extends DOMStringMap>(
    $element: HTMLElement,
    key: keyof Dataset extends string ? keyof Dataset : string,
  ): string | undefined => $element.dataset[key],
});

export const replaceWith = <T extends HTMLElement = HTMLElement>(
  $element: T,
  $newElement: T,
): T => {
  if ($element) {
    $element.replaceWith($newElement);
    return $newElement;
  }
  return $newElement;
};

export const isEventTargetHTMLElement = (
  target: EventTarget | null): target is HTMLElement => target instanceof HTMLElement;

export const isEventTargetHTMLInputElement = (
  target: EventTarget | null): target is HTMLInputElement => target instanceof HTMLInputElement;

export const isEventTargetHTMLButtonElement = (
  target: EventTarget | null,
): target is HTMLButtonElement => target instanceof HTMLButtonElement;

export const isHTMLElementOfClass = (
  target: EventTarget | null,
  className: string,
): target is HTMLElement => isEventTargetHTMLElement(target)
  && target.classList.contains(className);

export const isHTMLInputElementOfClass = (
  target: EventTarget | null,
  className: string,
): target is HTMLInputElement => isEventTargetHTMLInputElement(target)
  && target.classList.contains(className);

export const isHTMLButtonElementOfClass = (
  target: EventTarget | null,
  className: string,
): target is HTMLButtonElement => target instanceof HTMLButtonElement
  && target.classList.contains(className);
