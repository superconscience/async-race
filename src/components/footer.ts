import { Component } from '../types';
import { $ } from '../utils/functions';

class Footer implements Component {
  $element: HTMLElement;

  constructor() {
    this.$element = this.create();
  }

  element(): HTMLElement {
    return this.$element;
  }

  create(): HTMLElement {
    const $footer = $('footer', 'footer');
    return $footer;
  }
}

export default Footer;
