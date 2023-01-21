import Component from '../lib/component';
import { $, replaceWith } from '../utils/functions';

class StatusBox extends Component<HTMLDivElement> {
  static $element: HTMLDivElement;

  static readonly classes = {
    statusBox: 'status-box',
    message: 'status-box__message',
  };

  constructor() {
    super();
    StatusBox.$element = replaceWith(StatusBox.$element, this.create());
  }

  element(): HTMLDivElement {
    return StatusBox.$element;
  }

  create(): HTMLDivElement {
    const $container = $('div', StatusBox.classes.statusBox);
    $container.innerHTML = `<p class="${StatusBox.classes.message}"></p>`;

    return $container;
  }

  static setMessage(message: string): void {
    const $message = StatusBox.$element.querySelector<HTMLParagraphElement>(
      `.${StatusBox.classes.message}`,
    );
    if ($message) {
      $message.textContent = message;
    }
  }
}

export default StatusBox;
