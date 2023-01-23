import App from '../lib/app';
import Router from '../lib/router';
import { Actions, Component } from '../types';
import { $ } from '../utils/functions';
import GarageView from '../views/garage';
import WinnersView from '../views/winners';
import Button from './button';

class Header implements Component {
  $element: HTMLElement;

  create(): HTMLElement {
    const $header = $('header', 'header');
    const $wrapper = $('div', 'navigation');
    const btnClassName = 'navigation__button';
    const btnClassNameActive = `${btnClassName}_active`;
    const action = App.getRouter().getAction();
    const $garageButton = new Button(
      'Garage', `${btnClassName} ${action === Actions.Garage ? btnClassNameActive : ''}`, () => {
        Router.push(Actions.Garage, [GarageView.stateHistory.current.page]);
      },
    ).element();
    const $winnersButton = new Button(
      'Winners', `${btnClassName} ${action === Actions.Winners ? btnClassNameActive : ''}`, () => {
        Router.push(Actions.Winners, [WinnersView.stateHistory.current.page], {
          sort: WinnersView.stateHistory.current.sort,
          order: WinnersView.stateHistory.current.order,
        });
      },
    ).element();

    $wrapper.append($garageButton, $winnersButton);

    $header.append($wrapper);
    return $header;
  }

  constructor() {
    this.$element = this.create();
  }

  element(): HTMLElement {
    return this.$element;
  }
}

export default Header;
