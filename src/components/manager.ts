import App from '../lib/app';
import { Component, RaceStatus } from '../types';
import {
  $,
  isHTMLButtonElementOfClass,
  replaceWith,
} from '../utils/functions';
import GarageView from '../views/garage';
import Button from './button';
import ConstructorPanel from './constructor-panel';
import Garage from './garage';
import GarageList from './garage-list';
import Loader from './loader';
import Popup from './popup';

class Manager implements Component {
  static $element: HTMLElement;

  static readonly classes = {
    manager: 'manager',
    controlPanel: 'manager__control-panel',
    startRace: 'start-race',
    resetRace: 'reset-race',
    generateCars: 'generate-cars',
    started: 'manager_race-started',
    hasWinner: 'manager_race-has-winner',
    soloStarted: 'manager_solo-race-started',
    soloFinished: 'manager_solo-race-finished',
  };

  constructor() {
    Manager.$element = replaceWith(Manager.$element, this.create());
  }

  element(): HTMLElement {
    return Manager.$element;
  }

  create(): HTMLElement {
    const $container = $('div', Manager.classes.manager);
    const $constructorPanel = new ConstructorPanel().element();
    const $controlPanel = $('div', Manager.classes.controlPanel);

    $container.append($constructorPanel, $controlPanel);

    $controlPanel.append(
      this.createStartRaceButton(),
      this.createResetRaceButton(),
      this.createGenerateCarsButton(),
    );

    return $container;
  }

  private createStartRaceButton(): HTMLButtonElement {
    return new Button('Race', Manager.classes.startRace, this.startRaceClickHandler).element();
  }

  private createResetRaceButton(): HTMLButtonElement {
    return new Button('Reset', Manager.classes.resetRace, Manager.resetRace).element();
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
      GarageView.getPage());

    GarageList.refresh();
    Loader.off();
  };

  private startRaceClickHandler: EventListener = async (event) => {
    if (!isHTMLButtonElementOfClass(event.target, Manager.classes.startRace)) {
      return;
    }

    if (Garage.garageItems.length === 0) {
      return;
    }

    this.setRaceAsMultiple();

    await this.startRace();
  };

  private async startRace(): Promise<void> {
    if (Garage.garageItems.length === 0) {
      return;
    }

    Manager.$element.classList.add(Manager.classes.started);

    await App.getController().getWinnerModel().fetchWinners();
    App.getStore().cars.raceTimer = Date.now();

    await Promise.allSettled(
      Garage.garageItems.map((item) => item.start()),
    );
  }

  static async resetRace(): Promise<void> {
    const carsStore = App.getStore().cars;
    carsStore.resetRace();
    await Promise.allSettled(
      Garage.garageItems.map((item) => item.resetCar()),
    );
    Popup.hide();
    Manager.resetStyle();
    Manager.$element.classList.remove(Manager.classes.started);
  }

  private setRaceAsMultiple(): void {
    App.getStore().cars.isSoloRace = false;
  }

  static updateStyle(): void {
    const { cars: { raceStatus } } = App.getStore();

    Manager.resetStyle();

    Manager.$element.classList.toggle(
      Manager.classes.soloStarted, raceStatus === RaceStatus.SoloStarted);

    Manager.$element.classList.toggle(
      Manager.classes.soloFinished, raceStatus === RaceStatus.SoloFinished);

    Manager.$element.classList.toggle(
      Manager.classes.hasWinner, raceStatus === RaceStatus.HasWinner);
  }

  static resetStyle(): void {
    Manager.$element.classList.remove(
      Manager.classes.hasWinner,
      Manager.classes.soloStarted,
      Manager.classes.soloFinished,
    );
  }
}

export default Manager;
