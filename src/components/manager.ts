import App from '../lib/app';
import { Component } from '../types';
import {
  $,
  isHTMLButtonElementOfClass,
} from '../utils/functions';
import Button from './button';
import ConstructorPanel from './constructor-panel';
import GarageList from './garage-list';
import Loader from './loader';

class Manager implements Component {
  $element: HTMLElement;

  static readonly classes = {
    manager: 'manager',
    controlPanel: 'manager__control-panel',
    startRace: 'start-race',
    resetRace: 'reset-race',
    generateCars: 'generate-cars',
  };

  constructor() {
    this.$element = this.create();
  }

  element(): HTMLElement {
    return this.$element;
  }

  create(): HTMLElement {
    const $container = $('div', Manager.classes.manager);
    const $constructorPanel = new ConstructorPanel().element();
    const $controlPanel = $('div', Manager.classes.controlPanel);

    $container.append($constructorPanel, $controlPanel);

    $controlPanel.append(
      this.createRaceButton(),
      this.createResetButton(),
      this.createGenerateCarsButton(),
    );

    return $container;
  }

  private createRaceButton(): HTMLButtonElement {
    return new Button('Race', Manager.classes.startRace).element();
  }

  private createResetButton(): HTMLButtonElement {
    return new Button('Reset', Manager.classes.resetRace).element();
  }

  private createGenerateCarsButton(): HTMLButtonElement {
    return new Button('Generate Cars', Manager.classes.generateCars, this.generateCarsButtonClickHandler).element();
  }

  private generateCarsButtonClickHandler: EventListener = async (event) => {
    if (!isHTMLButtonElementOfClass(event.target, Manager.classes.generateCars)) {
      return;
    }

    Loader.on();
    await App.getController().getCarModel().generateCars(
      App.getController().getGarageView().getPage());

    GarageList.refresh();
    Loader.off();
  };
}

export default Manager;
