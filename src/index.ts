import ConstructorItem from './components/constructor-item';
import GarageItem from './components/garage-item';
import App from './lib/app';
import Router from './lib/router';
import { Actions, CustomEvents } from './types';
import GarageView from './views/garage';

const defaultRoute = Router.createLink(Actions.Garage);

(function initialize() {
  window.history.replaceState(Router.createState(defaultRoute), '', defaultRoute);
}());

document.addEventListener(CustomEvents.BEFOREROUTERPUSH, () => {
  const currentAction = App.getRouter().getAction();
  if (currentAction === Actions.Garage) {
    const $nameInputCreate = document.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.nameInputCreate}`);
    const $colorInputCreate = document.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.colorInputCreate}`);
    if ($nameInputCreate && $colorInputCreate) {
      GarageView.createEditorState = {
        name: $nameInputCreate.value,
        color: $colorInputCreate.value,
      };
    }
    [...document.querySelectorAll<HTMLElement>(`.${GarageItem.classes.garageItem}`)].forEach(($elem) => {
      const { carId } = $elem.dataset;
      if (carId !== undefined) {
        const toggle = $elem.classList.contains(GarageItem.classes.garageItemUpdate);
        const $nameInput = $elem.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.nameInputUpdate}`);
        const $colorInput = $elem.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.colorInputUpdate}`);

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
    });
  }
});

async function main() {
  await App.run();
}

window.onpopstate = (event) => {
  if (event.state) {
    App.run();
  }
};

main();
