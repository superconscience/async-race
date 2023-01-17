import { CARS_PER_PAGE } from '../constants';
import App from '../lib/app';
import { CarId, Component } from '../types';
import { $, replaceWith } from '../utils/functions';
import GarageHeading from './garage-heading';
import GarageItem from './garage-item';

class GarageList implements Component<HTMLDivElement> {
  static $element: HTMLDivElement;

  private static readonly classes = {
    garageList: 'garage-list',
    pageHeading: 'garage__page-heading',
    ListWrapper: 'garage__garage-list-wrapper',
    listItem: 'garage-list__item',
    pagination: 'garage-list__pagination',
    paginationItem: 'garage-list__pagination-item',
    paginationLink: 'garage-list__pagination-link',
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
    const $pagination = this.createPagination();

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

  private createPagination(): HTMLUListElement {
    const $container = $('ul', GarageList.classes.pagination);
    const listItemsCount = App.getStore().cars.cars.length;
    const pagesCount = Math.ceil(listItemsCount / CARS_PER_PAGE) || 1;
    const pageNumbers = Array(pagesCount).fill(0).map((_, i) => i + 1);

    pageNumbers.forEach((number) => {
      const $item = $('li', GarageList.classes.paginationItem);
      $item.textContent = number.toString();

      $container.append($item);
    });

    return $container;
  }

  private createPageHeading(): HTMLHeadingElement {
    const $heading = $('h3', GarageList.classes.pageHeading);

    $heading.textContent = `Page #${App.getController().getGarageView().getPage()}`;

    return $heading;
  }

  static refresh() {
    new GarageList();
    GarageHeading.refresh();
  }
}

export default GarageList;
