import bindEvents from './events';
import App from './lib/app';
import Router from './lib/router';
import { Actions } from './types';

const defaultRoute = Router.createLink(Actions.Garage);

(function initialize() {
  window.history.replaceState(Router.createState(defaultRoute), '', defaultRoute);
}());

bindEvents();

async function main() {
  App.run();
}

window.onpopstate = (event) => {
  if (event.state) {
    App.run();
  }
};

main();
