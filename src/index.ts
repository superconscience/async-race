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
    const page = GarageView.getPage();
    const inputs = document.querySelectorAll('input');
    GarageView.inputState[page] = [...inputs];
    GarageView.updateItemsShownState[page] = [...document.querySelectorAll(`.${GarageItem.classes.garageItem}`)]
      .map(($elem) => $elem.classList.contains(GarageItem.classes.garageItemUpdate));
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
