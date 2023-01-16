import Router from '../lib/router';
import { Actions, Component } from '../types';
import { $ } from '../utils/functions';
import LinkButton from './link-button';

class Header implements Component {
  $element: HTMLElement;

  create(): HTMLElement {
    const $header = $('header', 'header');
    const $garageLink = new LinkButton('To Garage', '', Router.createLink(Actions.Garage)).element();
    const $winnersLink = new LinkButton('To Winner', '', Router.createLink(Actions.Winners)).element();

    $header.append($garageLink, $winnersLink);
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
