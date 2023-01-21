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
    const garagePage = GarageView.getPage();
    const winnersPage = WinnersView.getPage();
    const $garageButton = new Button('To Garage', '', () => { Router.push(Actions.Garage, garagePage ? [garagePage] : []); }).element();
    const $winnersButton = new Button('To Winners', '', () => { Router.push(Actions.Winners, winnersPage ? [winnersPage] : []); }).element();

    $header.append($garageButton, $winnersButton);
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
