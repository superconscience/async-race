import Component from '../lib/component';
import { $, replaceWith } from '../utils/functions';

class Loader extends Component<HTMLDivElement> {
  static $element: HTMLDivElement;

  constructor() {
    super();
    Loader.$element = replaceWith(Loader.$element, this.create());
  }

  element(): HTMLDivElement {
    return Loader.$element;
  }

  private create(): HTMLDivElement {
    return $('div', 'loader');
  }

  static toggle(toggle: boolean): void {
    Loader.$element.classList.toggle('loader_on', toggle);
  }

  static on(): void {
    Loader.toggle(true);
  }

  static off(): void {
    Loader.toggle(false);
  }
}

export default Loader;
