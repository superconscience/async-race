import { CARS_PER_PAGE } from '../constants';
import App from '../lib/app';
import { CarId, Component } from '../types';
import { $, replaceWith } from '../utils/functions';
import GarageView from '../views/garage';
import GarageHeading from './garage-heading';
import GarageItem from './garage-item';
import Pagination from './pagination';

class GarageList implements Component<HTMLDivElement> {
  static $element: HTMLDivElement;

  private static readonly classes = {
    garageList: 'garage-list',
    pageHeading: 'garage__page-heading',
    ListWrapper: 'garage__garage-list-wrapper',
    listItem: 'garage-list__item',
  };

  constructor() {
    GarageList.$element = replaceWith(GarageList.$element, this.create());
  }

  element(): HTMLDivElement {
    return GarageList.$element;
  }

  private create(): HTMLDivElement {
    return this.createGarageList();
  }

  private createGarageList(): HTMLDivElement {
    const { cars: { cars } } = App.getStore();
    const $container = $('div', GarageList.classes.ListWrapper);
    const $pageHeading = this.createPageHeading();
    const $list = $('ul', GarageList.classes.garageList);
    const $pagination = new Pagination(CARS_PER_PAGE).element();

    $container.append($pageHeading, $pagination, $list);

    cars.forEach(({ name, color, id }) => {
      $list.append(this.createGarageListItem(name, color, id));
    });

    return $container;
  }

  private createGarageListItem(
    name: string,
    color: string,
    id: CarId,
  ): HTMLLIElement {
    const $container = $('li', GarageList.classes.listItem);
    const garageItem = new GarageItem(id, name, color);
    const $item = garageItem.element();

    $container.append($item);

    return $container;
  }

  private createPageHeading(): HTMLHeadingElement {
    const $heading = $('h3', GarageList.classes.pageHeading);

    $heading.textContent = `Page #${GarageView.getPage()} of ${App.getStore().cars.getTotalPages()}`;

    return $heading;
  }

  static refresh() {
    new GarageList();
    GarageHeading.refresh();
  }
}

export default GarageList;
