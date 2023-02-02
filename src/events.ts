import ConstructorItem from './components/constructor-item';
import GarageItem from './components/garage-item';
import Loader from './components/loader';
import Manager from './components/manager';
import App from './lib/app';
import { Actions, CustomEvents } from './types';
import GarageView from './views/garage';

function storeGarageItemUpdateEditorState($elem: HTMLElement): void {
  const { carId } = $elem.dataset;
  if (carId !== undefined) {
    const toggle = $elem.classList.contains(
      GarageItem.classes.garageItemUpdate,
    );
    const $nameInput = $elem.querySelector<HTMLInputElement>(
      `.${ConstructorItem.classes.nameInputUpdate}`,
    );
    const $colorInput = $elem.querySelector<HTMLInputElement>(
      `.${ConstructorItem.classes.colorInputUpdate}`,
    );

    if ($nameInput && $colorInput) {
      if (!GarageView.updateEditorsState) {
        GarageView.updateEditorsState = {};
      }
      GarageView.updateEditorsState[carId] = {
        name: $nameInput.value,
        color: $colorInput.value,
        toggle,
      };
    }
  }
}

function storeGarageState(): void {
  const currentAction = App.getRouter().getAction();
  if (currentAction === Actions.Garage) {
    const $nameInputCreate = document.querySelector<HTMLInputElement>(
      `.${ConstructorItem.classes.nameInputCreate}`,
    );
    const $colorInputCreate = document.querySelector<HTMLInputElement>(
      `.${ConstructorItem.classes.colorInputCreate}`,
    );
    if ($nameInputCreate && $colorInputCreate) {
      GarageView.createEditorState = {
        name: $nameInputCreate.value,
        color: $colorInputCreate.value,
      };
    }
    [
      ...document.querySelectorAll<HTMLElement>(
        `.${GarageItem.classes.garageItem}`,
      ),
    ].forEach(($elem) => {
      storeGarageItemUpdateEditorState($elem);
    });
  }
}

function resetRace(): void {
  Loader.on();
  Manager.resetRace();
}

function bindEvents() {
  document.addEventListener(CustomEvents.BEFOREROUTERPUSH, storeGarageState);
  document.addEventListener(CustomEvents.BEFOREROUTERPUSH, resetRace);
}

export default bindEvents;
