import { Component } from '../types';
import { $ } from '../utils/functions';

class Button implements Component<HTMLButtonElement> {
  static $element: HTMLButtonElement;

  constructor(title: string, className: string, onClick?: (event: MouseEvent) => void) {
    Button.$element = this.create(title, className, onClick);
  }

  create(title: string, className: string, onClick?: (event: MouseEvent) => void) {
    const $button = $('button', `btn ${className}`);

    $button.className = className;
    $button.textContent = title;

    if (onClick) {
      $button.onclick = onClick;
    }

    return $button;
  }

  element(): HTMLButtonElement {
    return Button.$element;
  }
}

export default Button;
