import { Component } from '../types';
import { $ } from '../utils/functions';
import Winners from './winners';

class WinnersMain implements Component {
  $element: HTMLElement;

  constructor() {
    this.$element = this.create();
  }

  element(): HTMLElement {
    return this.$element;
  }

  create(): HTMLElement {
    const $main = $('main', 'main');
    const $winners = new Winners().element();

    $main.append($winners);

    return $main;
  }
}

export default WinnersMain;
