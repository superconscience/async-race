import App from '../lib/app';
import { CarId, Component } from '../types';
import {
  $, createCar, isHTMLButtonElementOfClass, isHTMLElementOfClass,
} from '../utils/functions';
import GarageView from '../views/garage';
import Button from './button';
import Garage from './garage';
import GarageItem from './garage-item';
import Loader from './loader';

export type ConstructorMode = 'create' | 'update';

class ConstructorItem<T extends ConstructorMode = 'create'> implements Component {
  $element: HTMLElement;

  static readonly classes = {
    constructorItem: 'constructor-item',
    nameInput: 'constructor-item__input',
    nameInputCreate: 'constructor-item__input_create',
    nameInputUpdate: 'constructor-item__input_update',
    colorInput: 'constructor-item__color',
    colorInputCreate: 'constructor-item__color_create',
    colorInputUpdate: 'constructor-item__color_update',
    createBtn: 'constructor-item__create',
    updateBtn: 'constructor-item__update',
    cancelBtn: 'constructor-item__cancel',
  };

  mode: ConstructorMode;

  id: T extends 'create' ? undefined : CarId;

  constructor(mode: T, id: T extends 'create' ? undefined : CarId) {
    this.mode = mode;
    this.id = id;
    this.$element = this.create();
  }

  element(): HTMLElement {
    return this.$element;
  }

  create() {
    return this.createConstructorItem();
  }

  private createConstructorItem(): HTMLElement {
    const isCreateMode = this.mode === 'create';
    const $item = $('div', ConstructorItem.classes.constructorItem);
    const $nameInput = this.createCarNameInput();
    const $colorInput = this.createColorPicker();
    const $createBtn = this.createCreateButton();
    const $updateBtn = this.createUpdateButton();
    const $cancelBtn = this.createCancelButton();

    if (this.id) {
      const car = App.getStore().cars.carsMap[this.id];

      $nameInput.value = car.name;
      $colorInput.value = car.color;
    }

    $item.append($nameInput, $colorInput, isCreateMode ? $createBtn : $updateBtn);
    if (isCreateMode) {
      $nameInput.classList.add(ConstructorItem.classes.nameInputCreate);
      $colorInput.classList.add(ConstructorItem.classes.colorInputCreate);
    } else {
      $item.append($cancelBtn);
      $nameInput.classList.add(ConstructorItem.classes.nameInputUpdate);
      $colorInput.classList.add(ConstructorItem.classes.colorInputUpdate);
    }

    return $item;
  }

  private createCarNameInput(): HTMLInputElement {
    const $input = $('input', ConstructorItem.classes.nameInput);
    $input.placeholder = 'Enter Brand - Model';
    return $input;
  }

  private createColorPicker(): HTMLInputElement {
    const $color = $('input', ConstructorItem.classes.colorInput);
    $color.type = 'color';
    return $color;
  }

  private createCreateButton(): HTMLButtonElement {
    const $button = new Button(
      'Create',
      ConstructorItem.classes.createBtn,
      this.createButtonClickHandler,
    );
    return $button.element();
  }

  private createUpdateButton(): HTMLButtonElement {
    const $button = new Button('Save', ConstructorItem.classes.updateBtn, this.updateButtonClickHandler);
    return $button.element();
  }

  private createCancelButton(): HTMLButtonElement {
    const $button = new Button('Cancel', ConstructorItem.classes.cancelBtn, this.cancelButtonClickHandler);
    return $button.element();
  }

  private createButtonClickHandler: EventListener = async (event) => {
    const $target = event.target;

    if (!(isHTMLElementOfClass($target, ConstructorItem.classes.createBtn))) {
      return;
    }

    const $nameInput = this.$element.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.nameInput}`);
    const $colorInput = this.$element.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.colorInput}`);

    if (!$colorInput || !$nameInput || !$nameInput.value || !$colorInput.value) {
      return;
    }

    const name = $nameInput.value.trim();
    const color = $colorInput.value;
    Loader.on();
    await App.getController().getCarModel().createCar(
      createCar(name, color),
      GarageView.getPage());

    ConstructorItem.onCarCreate();
    this.resetInputs();
    Loader.off();
  };

  private updateButtonClickHandler: EventListener = async (event) => {
    const $target = event.target;

    if (!(isHTMLElementOfClass($target, ConstructorItem.classes.updateBtn)) || !this.id) {
      return;
    }

    const $nameInput = this.$element.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.nameInput}`);
    const $colorInput = this.$element.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.colorInput}`);

    if (!$colorInput || !$nameInput || !$nameInput.value || !$colorInput.value) {
      return;
    }

    const carsStore = App.getStore().cars;
    const name = $nameInput.value.trim();
    const color = $colorInput.value;

    Loader.on();
    const updatedCar = await App.getController().getCarModel().updateCar(
      this.id, createCar(name, color));

    carsStore.updateCar(this.id, updatedCar);
    ConstructorItem.onCarUpdate();
    this.resetInputs();
    Loader.off();
  };

  private cancelButtonClickHandler: EventListener = (event) => {
    const $target = event.target;

    if (!(isHTMLButtonElementOfClass($target, ConstructorItem.classes.cancelBtn))) {
      return;
    }

    const $garageItem = $target.closest(`.${GarageItem.classes.garageItem}`);

    if ($garageItem) {
      $garageItem.classList.remove(GarageItem.classes.garageItemUpdate);
    }

    this.resetInputs();
  };

  private resetInputs() {
    const { carsMap } = App.getStore().cars;
    const $nameInput = this.$element.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.nameInput}`);
    const $colorInput = this.$element.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.colorInput}`);

    if ($nameInput) {
      if (this.mode === 'create') {
        $nameInput.value = '';
      } else if (this.id) {
        $nameInput.value = carsMap[this.id].name;
      }
    }

    if ($colorInput) {
      if (this.mode === 'create') {
        $colorInput.value = '#000000';
      } else if (this.id) {
        $colorInput.value = carsMap[this.id].color;
      }
    }
  }

  static onCarCreate(): void {
    Garage.refresh();
  }

  static onCarUpdate(): void {
    Garage.refresh();
  }
}

export default ConstructorItem;
