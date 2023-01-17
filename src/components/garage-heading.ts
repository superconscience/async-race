import App from '../lib/app';
import Component from '../lib/component';
import { $, replaceWith } from '../utils/functions';

class GarageHeading extends Component<HTMLHeadingElement> {
  static $element: HTMLHeadingElement;

  constructor() {
    super();
    GarageHeading.$element = replaceWith(GarageHeading.$element, this.create());
  }

  element(): HTMLHeadingElement {
    return GarageHeading.$element;
  }

  private create(): HTMLHeadingElement {
    const $heading = $('h2', 'garage__heading');
    $heading.textContent = `${App.getController().getGarageView().getName()} (${
      App.getStore().cars.getTotalCount()
    })`;

    return $heading;
  }

  static refresh() {
    new GarageHeading();
  }
}

export default GarageHeading;
