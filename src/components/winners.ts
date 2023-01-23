import App from '../lib/app';
import { Component } from '../types';
import { $, replaceWith } from '../utils/functions';
import WinnersList from './winners-list';

class Winners implements Component {
  static $element: HTMLElement;

  private static readonly classes = {
    winners: 'winners',
    heading: 'winners__heading',
    winnersList: 'winners__winners-list',
    winnersListItem: 'winners__winners-list-item',
  };

  constructor() {
    Winners.$element = replaceWith(Winners.$element, this.create());
  }

  element(): HTMLElement {
    return Winners.$element;
  }

  create(): HTMLElement {
    const $container = $('div', Winners.classes.winners);
    const $heading = $('h2', Winners.classes.heading);
    const $winnersList = new WinnersList().element();

    $container.append($heading, $winnersList);

    $heading.textContent = `${App.getController().getWinnersView().getName()} (${
      App.getStore().winners.getTotalCount()
    })`;

    return $container;
  }

  static refresh() {
    new Winners();
  }
}

export default Winners;
