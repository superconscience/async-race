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
    $footer.innerHTML = `<div class="footer__wrapper"><p class="copyright">© Async Race 2023</p><ul class="footer__links">
      <li class="footer__links-item"><a class="footer__link" href="https://github.com/superconscience"><span class="icon icon_github"></span></a></li>
      <li class="footer__links-item"><a class="footer__link" href="https://rs.school/js/"><span class="icon icon_rsschool"></span></a></li>
      </ul></div>`;
    return $footer;
  }
}

export default Footer;
