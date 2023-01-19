import { SetEngineResponseData } from '../lib/api-client';
import App from '../lib/app';
import {
  CarId,
  Car as CarType,
  Component, EngineStatus,
} from '../types';
import {
  $, isHTMLButtonElementOfClass, isHTMLElementOfClass,
} from '../utils/functions';
import Button from './button';
import Car from './car';
import ConstructorItem from './constructor-item';
import Garage from './garage';
import Loader from './loader';
import Manager from './manager';
import Popup from './popup';

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
    drive: 'drive',
    stop: 'stop',
    finish: 'finish',
  };

  constructor(id: CarId, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.$element = this.create();
    Garage.garageItems.push(this);
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

    $container.append($topContainer, $bottomContainer, $car, $track);
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
    return new Button('Go!', `${GarageItem.classes.startBtn} start-car`, this.startButtonClickHandler).element();
  }

  private createStopButton(): HTMLButtonElement {
    return new Button('Stop!', `${GarageItem.classes.stopBtn} stop-car`, this.stopButtonClickHandler).element();
  }

  private createCarName(): HTMLHeadingElement {
    const $heading = $('h4', GarageItem.classes.carName);

    $heading.textContent = this.name;

    return $heading;
  }

  private createCar(): HTMLDivElement {
    const $car = new Car(this.color).element();
    $car.classList.add(GarageItem.classes.car);

    $car.onanimationend = this.carAnimationEndHandler;
    $car.onanimationcancel = this.carAnimationPauseHandler;
    $car.onanimationstart = this.carAnimationStartHandler;

    return $car;
  }

  private createTrack(): HTMLDivElement {
    return $('div', `${GarageItem.classes.track} track`);
  }

  async start() {
    Loader.on();
    const engineData = await App.getController().getCarModel().setEngine(
      this.id, EngineStatus.Started).catch(() => { Loader.off(); });

    if (!engineData) {
      Loader.off();
      return;
    }

    this.driveCar(engineData);
    Loader.off();

    await App.getController()
      .getCarModel()
      .drive(this.id)
      .catch(() => this.stopCar());
  }

  private startButtonClickHandler: EventListener = async (event) => {
    const $target = event.target;

    if (!(isHTMLElementOfClass($target, GarageItem.classes.startBtn))) {
      return;
    }

    this.setRaceAsSolo();

    await this.start();
  };

  private setRaceAsSolo(): void {
    App.getStore().cars.isSoloRace = true;
  }

  private cancelRaceAsSolo(): void {
    App.getStore().cars.isSoloRace = false;
  }

  private stopButtonClickHandler: EventListener = async (event) => {
    const $target = event.target;

    if (!(isHTMLElementOfClass($target, GarageItem.classes.stopBtn))) {
      return;
    }

    this.cancelRaceAsSolo();

    const engineData = await App.getController().getCarModel().setEngine(
      this.id, EngineStatus.Stopped).catch();

    if (!engineData) {
      return;
    }
    this.resetCar(true);
  };

  private removeButtonClickHandler: EventListener = async (event) => {
    const $target = event.target;

    if (!(isHTMLElementOfClass($target, GarageItem.classes.removeBtn))) {
      return;
    }

    Loader.on();
    await App.getController().getCarModel().deleteCar(
      this.id, App.getController().getGarageView().getPage());

    GarageItem.onCarDelete();
    Loader.off();
  };

  private showUpdateButtonClickHandler: EventListener = (event) => {
    const $target = event.target;

    if (!(isHTMLButtonElementOfClass($target, GarageItem.classes.showUpdateBtn))) {
      return;
    }

    this.$element.classList.add(GarageItem.classes.garageItemUpdate);
  };

  private carAnimationEndHandler: EventListener = () => {
    this.finish();
  };

  private carAnimationStartHandler: EventListener = () => {
    this.onCarAnimationStatusChange();
  };

  private carAnimationPauseHandler: EventListener = () => {
    this.onCarAnimationStatusChange();
  };

  private onCarAnimationStatusChange(): void {
    Manager.updateStyle();
  }

  private getCarElement(): HTMLElement | null {
    return this.$element.querySelector<HTMLElement>(`.${GarageItem.classes.car}`);
  }

  private driveCar(engineData: SetEngineResponseData): void {
    const $car = this.getCarElement();

    if (!$car) {
      return;
    }

    this.resetCar(true);

    const animationDuration = Number(engineData.distance) / Number(engineData.velocity) / 1000;
    $car.style.animationDuration = `${animationDuration}s`;

    this.$element.classList.add(GarageItem.classes.drive);
    this.onCarAnimationStatusChange();
  }

  private stopCar(): void {
    const $car = this.getCarElement();

    if (!$car) {
      return;
    }

    $car.style.animationDuration = '';
    this.$element.classList.add(GarageItem.classes.stop);
    this.onCarAnimationStatusChange();
  }

  public resetCar(global = false): void {
    const $car = this.getCarElement();

    if (!$car) {
      return;
    }

    $car.style.animationDuration = '';
    this.$element.classList.remove(
      GarageItem.classes.drive,
      GarageItem.classes.stop,
      GarageItem.classes.finish,
    );
    if (global) {
      this.onCarAnimationStatusChange();
    }
  }

  private finishCar(): void {
    const $car = this.getCarElement();

    if (!$car) {
      return;
    }
    $car.style.animationDuration = '';
    this.$element.classList.add(GarageItem.classes.finish);
    this.onCarAnimationStatusChange();
  }

  private async finish(): Promise<void> {
    const maybeWinResult = await App.getController().getCarModel().finish(this.id);

    if (maybeWinResult) {
      this.notifyWinner(maybeWinResult.car, maybeWinResult.time);
    }

    this.finishCar();
  }

  private notifyWinner(winner: CarType, result: number): void {
    const $notification = $('div', 'win-notification fire-text');
    const $text = $('p', 'win-notification__text fire-text__content');
    $text.textContent = `${winner.name} finished first [${(result).toFixed(2)}s]!`;
    $notification.append($text);

    Popup.show($notification);
  }

  static onCarDelete(): void {
    Garage.refresh();
  }
}

export default GarageItem;
