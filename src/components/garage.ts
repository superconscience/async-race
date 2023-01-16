import App from '../lib/app';
import { Component } from '../types';
import { $ } from '../utils/functions';
import GarageList from './garage-list';

class Garage implements Component {
  $element: HTMLElement;

  private static readonly classes = {
    garage: 'garage',
    heading: 'garage__heading',
    pageHeading: 'garage__page-heading',
    garageListWrapper: 'garage__garage-list-wrapper',
    garageList: 'garage__garage-list',
    garageListItem: 'garage__garage-list-item',
  };

  constructor() {
    this.$element = this.create();
  }

  element(): HTMLElement {
    return this.$element;
  }

  create(): HTMLElement {
    const $container = $('div', Garage.classes.garage);
    const $heading = this.createHeading();
    const $pageHeading = this.createPageHeading();
    const $garageListWrapper = $('div', Garage.classes.garageListWrapper);
    const $garageList = new GarageList().element();

    $container.append($heading, $pageHeading, $garageListWrapper);

    $garageListWrapper.append($garageList);

    return $container;
  }

  private createHeading(): HTMLHeadingElement {
    const $heading = $('h2', Garage.classes.heading);
    $heading.textContent = `${App.getController().getGarageView().getName()} (${100})`;

    return $heading;
  }

  private createPageHeading(): HTMLHeadingElement {
    const $heading = $('h3', Garage.classes.pageHeading);

    $heading.textContent = `Page ${'#1'}`;

    return $heading;
  }
}

export default Garage;
