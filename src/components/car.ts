import CarSvg from '../car-svg';
import { Component } from '../types';
import { $ } from '../utils/functions';

class Car implements Component<HTMLDivElement> {
  $element: HTMLDivElement;

  color: string;

  constructor(color: string) {
    this.color = color;
    this.$element = this.create();
  }

  element(): HTMLDivElement {
    return this.$element;
  }

  create(): HTMLDivElement {
    const $container = $('div', 'car');

    $container.innerHTML = CarSvg;
    $container.style.fill = this.color;
    return $container;
  }
}

export default Car;
