import { $, isHTMLButtonElementOfClass, isHTMLElementOfClass } from '../utils/functions';
import Button from './button';
import ConstructorItem from './constructor-item';
import Car from './car';
import { CarId, Component } from '../types';
import App from '../lib/app';
import GarageList from './garage-list';

class GarageItem implements Component {
  $element: HTMLDivElement;

  id: CarId;

  name: string;

  color: string;

  private static readonly classes = {
    garageItem: 'garage-item',
    garageItemUpdate: 'garage-item_update',
    car: 'garage-item__car',
    track: 'garage-item__track',
    top: 'garage-item__top',
    bottom: 'garage-item__bottom',
    carName: 'garage-item__car-name',
    updateWrapper: 'garage-item__update-wrapper',
    showUpdateBtn: 'garage-item__btn-show-update-car',
    removeBtn: 'garage-item__btn-remove-car',
    startBtn: 'garage-item__btn-start',
    stopBtn: 'garage-item__btn-stop',
    updateItem: 'garage-item__update-item',
    construct: 'garage-item__construct',
  };

  constructor(id: CarId, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.$element = this.create();
  }

  element(): HTMLDivElement {
    return this.$element;
  }

  create() {
    const $container = $('div', GarageItem.classes.garageItem);
    const $car = this.createCar();
    const $track = this.createTrack();
    const $topContainer = this.createTopContainer();
    const $bottomContainer = this.createBottomContainer();

    $container.append($topContainer, $bottomContainer, $track, $car);
    return $container;
  }

  private createUpdateItem(): HTMLElement {
    return new ConstructorItem<'update'>('update', this.id).element();
  }

  private createShowUpdateButton(): HTMLButtonElement {
    return new Button(
      'Update',
      `${GarageItem.classes.showUpdateBtn} show-update-car`,
      this.showUpdateButtonClickHandler,
    ).element();
  }

  private createTopContainer(): HTMLDivElement {
    const $container = $('div', GarageItem.classes.top);
    const $updateWrapper = $('div', GarageItem.classes.updateWrapper);

    $container.append(
      $updateWrapper,
      this.createShowUpdateButton(),
      this.createRemoveButton(),
      this.createCarName(),
    );

    $updateWrapper.append(this.createUpdateItem());

    return $container;
  }

  private createBottomContainer(): HTMLDivElement {
    const $container = $('div', GarageItem.classes.bottom);

    $container.append(this.createStartButton(), this.createStopButton());

    return $container;
  }

  private createRemoveButton(): HTMLButtonElement {
    return new Button('Remove', `${GarageItem.classes.removeBtn} remove-car`, this.removeButtonClickHandler).element();
  }

  private createStartButton(): HTMLButtonElement {
    return new Button('Go!', `${GarageItem.classes.startBtn} start-car`, () => {}).element();
  }

  private createStopButton(): HTMLButtonElement {
    return new Button('Stop!', `${GarageItem.classes.stopBtn} stop-car`, () => {}).element();
  }

  private createCarName(): HTMLHeadingElement {
    const $heading = $('h4', GarageItem.classes.carName);

    $heading.textContent = this.name;

    return $heading;
  }

  private createCar(): HTMLDivElement {
    const $car = new Car(this.color).element();
    $car.classList.add(GarageItem.classes.car);

    return $car;
  }

  private createTrack(): HTMLDivElement {
    return $('div', `${GarageItem.classes.track} track`);
  }

  private removeButtonClickHandler: EventListener = async (event) => {
    const $target = event.target;

    if (!(isHTMLElementOfClass($target, GarageItem.classes.removeBtn))) {
      return;
    }

    await App.getApiClient().deleteCar(this.id);
    App.getStore().cars.deleteCar(this.id);
    GarageItem.onCarDelete();
  };

  private showUpdateButtonClickHandler: EventListener = (event) => {
    const $target = event.target;

    if (!(isHTMLButtonElementOfClass($target, GarageItem.classes.showUpdateBtn))) {
      return;
    }

    this.$element.classList.add(GarageItem.classes.garageItemUpdate);
  };

  static onCarDelete() {
    GarageList.refresh();
  }
}

export default GarageItem;
