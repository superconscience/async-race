import { Component } from '../types';
import { $ } from '../utils/functions';

class LinkButton implements Component {
  $element: HTMLAnchorElement;

  constructor(title: string, className: string, href: string) {
    this.$element = this.create(title, className, href);
  }

  element(): HTMLElement {
    return this.$element;
  }

  create(title: string, className: string, href: string): HTMLAnchorElement {
    const $button = $('a', `btn btn-link ${className}`);

    $button.className = className;
    $button.textContent = title;
    $button.href = href;

    return $button;
  }
}

export default LinkButton;
