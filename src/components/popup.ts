import Component from '../lib/component';
import { $, replaceWith } from '../utils/functions';

class Popup extends Component<HTMLDivElement> {
  static $element: HTMLDivElement;

  static readonly classes = {
    popup: 'popup',
    show: 'show',
  };

  constructor() {
    super();
    Popup.$element = replaceWith(Popup.$element, this.create());
  }

  create(): HTMLDivElement {
    const $container = $('div', Popup.classes.popup);
    return $container;
  }

  element(): HTMLDivElement {
    return Popup.$element;
  }

  static show($content: HTMLElement): void {
    Popup.$element.innerHTML = '';
    Popup.$element.append($content);
    Popup.$element.classList.add(Popup.classes.show);
  }

  static hide(): void {
    Popup.$element.classList.remove(Popup.classes.show);
  }
}

export default Popup;
