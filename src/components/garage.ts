import { Component } from '../types';
import { $, replaceWith } from '../utils/functions';
import GarageHeading from './garage-heading';
import GarageItem from './garage-item';
import GarageList from './garage-list';

class Garage implements Component {
  static $element: HTMLElement;

  static garageItems: GarageItem[] = [];

  private static readonly classes = {
    garage: 'garage',
    heading: 'garage__heading',
    garageList: 'garage__garage-list',
    garageListItem: 'garage__garage-list-item',
  };

  constructor() {
    Garage.garageItems = [];
    Garage.$element = replaceWith(Garage.$element, this.create());
  }

  element(): HTMLElement {
    return Garage.$element;
  }

  create(): HTMLElement {
    const $container = $('div', Garage.classes.garage);
    const $heading = new GarageHeading().element();
    const $garageList = new GarageList().element();

    $container.append($heading, $garageList);

    return $container;
  }

  static refresh() {
    new Garage();
  }
}

export default Garage;
