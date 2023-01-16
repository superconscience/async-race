import App from '../lib/app';
import { CarId, Component } from '../types';
import { $, replaceWith } from '../utils/functions';
import GarageItem from './garage-item';

class GarageList implements Component<HTMLUListElement> {
  static $element: HTMLUListElement;

  private static readonly classes = {
    garageList: 'garage-list',
    garageListItem: 'garage-list__item',
  };

  constructor() {
    GarageList.$element = replaceWith(GarageList.$element, this.create());
  }

  element(): HTMLUListElement {
    return GarageList.$element;
  }

  create(): HTMLUListElement {
    return this.createGarageList();
  }

  private createGarageList(): HTMLUListElement {
    const { cars: { cars } } = App.getStore();
    const $list = $('ul', GarageList.classes.garageList);

    cars.forEach(({ name, color, id }) => {
      $list.append(this.createGarageListItem(name, color, id));
    });

    return $list;
  }

  private createGarageListItem(
    name: string,
    color: string,
    id: CarId,
  ): HTMLLIElement {
    const $container = $('li', GarageList.classes.garageListItem);
    const garageItem = new GarageItem(id, name, color);
    const $item = garageItem.element();

    $container.append($item);

    return $container;
  }

  static refresh() {
    new GarageList();
  }
}

export default GarageList;
