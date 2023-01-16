import { Component } from '../types';
import { $ } from '../utils/functions';
import Garage from './garage';
import Manager from './manager';

class GarageMain implements Component {
  $element: HTMLElement;

  constructor() {
    this.$element = this.create();
  }

  element(): HTMLElement {
    return this.$element;
  }

  create(): HTMLElement {
    const $main = $('main', 'main');
    const $manager = new Manager().element();
    const $garage = new Garage().element();

    $main.append($manager, $garage);

    return $main;
  }
}

export default GarageMain;
