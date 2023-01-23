import { WINNERS_PER_PAGE } from '../constants';
import { OrderParam, WinnersRequestParams, WinnersSortParam } from '../lib/api-client';
import App from '../lib/app';
import Router from '../lib/router';
import { Actions, Component } from '../types';
import { $, replaceWith } from '../utils/functions';
import WinnersView from '../views/winners';
import Car from './car';
import GarageHeading from './garage-heading';
import Pagination from './pagination';

type WinnersListItemProps = {
  number: number,
  name: string,
  color: string,
  wins: number,
  bestTime: number,
};

class WinnersList implements Component<HTMLDivElement> {
  static $element: HTMLDivElement;

  private static readonly classes = {
    winnersList: 'winners-list',
    notFound: 'winners-list__not-found',
    pageHeading: 'winners__page-heading',
    ListWrapper: 'winners__winners-list-wrapper',
    listItem: 'winners-list__item',
    listHeadItem: 'winners-list__head-item',
    listItemNumber: 'winners-list__number',
    listItemCar: 'winners-list__car',
    listItemCarName: 'winners-list__car-name',
    listItemWins: 'winners-list__wins',
    listItemBestTime: 'winners-list__best-time',
  };

  constructor() {
    WinnersList.$element = replaceWith(WinnersList.$element, this.create());
  }

  element(): HTMLDivElement {
    return WinnersList.$element;
  }

  private create(): HTMLDivElement {
    return this.createWinnersList();
  }

  private createWinnersList(): HTMLDivElement {
    const { cars: carsStore, winners: winnersStore } = App.getStore();
    const $container = $('div', WinnersList.classes.ListWrapper);
    const $pageHeading = this.createPageHeading();
    const $list = $('ul', WinnersList.classes.winnersList);
    const $notFound = $('p', WinnersList.classes.notFound);
    const $pagination = new Pagination(
      WINNERS_PER_PAGE,
      winnersStore.getTotalCount(),
      WinnersView.getPage(),
      Actions.Winners,
    ).element();

    if (winnersStore.winners.length > 0) {
      $list.append(this.createWinnersListHeadItem());
      winnersStore.winners.forEach(({ id, time, wins }) => {
        const car = carsStore.allCars.find((x) => x.id === id);
        const number = winnersStore.allWinners.findIndex((x) => x.id === id);
        if (car) {
          $list.append(this.createWinnersListItem({
            number: number + 1,
            name: car.name,
            color: car.color,
            bestTime: time,
            wins,
          }));
        }
      });
      $container.append($pageHeading, $pagination, $list);
    } else {
      $notFound.textContent = 'No winners yet. No losers either.';
      $container.append($notFound);
    }

    return $container;
  }

  private createWinnersListItem({
    number, name, color, wins, bestTime,
  }: WinnersListItemProps): HTMLLIElement {
    const $container = $('li', WinnersList.classes.listItem);
    $container.innerHTML = `<div class="${WinnersList.classes.listItemNumber}">${number}</div>
      <div class="${WinnersList.classes.listItemCar}">${new Car(color).element().outerHTML}</div>
      <div class="${WinnersList.classes.listItemCarName}">${name}</div>
      <div class="${WinnersList.classes.listItemWins}">${wins}</div>
      <div class="${WinnersList.classes.listItemBestTime}">${bestTime.toFixed(2)}</div>
    `;

    return $container;
  }

  private createWinnersListHeadItem(): HTMLLIElement {
    const $container = $('li', `${WinnersList.classes.listItem} ${WinnersList.classes.listHeadItem}`);

    const searchParams = App.getRouter().getSearch();
    const sortParam = searchParams.sort;
    const orderParam = searchParams.order;
    const orderAscIcon = '▴';
    const orderDescIcon = '▾';

    let numberOrderIcon = ' ';
    let winsOrderIcon = ' ';
    let bestTimeOrderIcon = ' ';

    if (sortParam === WinnersSortParam.Id) {
      if (orderParam === OrderParam.ASC) {
        numberOrderIcon += orderAscIcon;
      } else {
        numberOrderIcon += orderDescIcon;
      }
    } else if (sortParam === WinnersSortParam.Wins) {
      if (orderParam === OrderParam.ASC) {
        winsOrderIcon += orderAscIcon;
      } else {
        winsOrderIcon += orderDescIcon;
      }
    } else if (sortParam === WinnersSortParam.Time) {
      if (orderParam === OrderParam.ASC) {
        bestTimeOrderIcon += orderAscIcon;
      } else {
        bestTimeOrderIcon += orderDescIcon;
      }
    }

    $container.innerHTML = `<div class="${WinnersList.classes.listItemNumber}">#${numberOrderIcon}</div>
      <div class="${WinnersList.classes.listItemCar}">Car</div>
      <div class="${WinnersList.classes.listItemCarName}">Name</div>
      <div class="${WinnersList.classes.listItemWins}">Wins${winsOrderIcon}</div>
      <div class="${WinnersList.classes.listItemBestTime}">Best Time (seconds)${bestTimeOrderIcon}</div>
    `;

    const $number = $container.querySelector<HTMLElement>(`.${WinnersList.classes.listItemNumber}`);
    const $wins = $container.querySelector<HTMLElement>(`.${WinnersList.classes.listItemWins}`);
    const $bestTime = $container.querySelector<HTMLElement>(`.${WinnersList.classes.listItemBestTime}`);

    if ($number) {
      $number.addEventListener('click', this.createSortClickHandler(WinnersSortParam.Id));
    }

    if ($wins) {
      $wins.addEventListener('click', this.createSortClickHandler(WinnersSortParam.Wins));
    }

    if ($bestTime) {
      $bestTime.addEventListener('click', this.createSortClickHandler(WinnersSortParam.Time));
    }

    return $container;
  }

  private createPageHeading(): HTMLHeadingElement {
    const $heading = $('h3', WinnersList.classes.pageHeading);

    $heading.textContent = `Page #${WinnersView.getPage()} of ${App.getStore().winners.getTotalPages()}`;

    return $heading;
  }

  private createSortClickHandler: (
    sortParam: WinnersSortParam
  ) => EventListener = (sortParam) => () => {
      const searchParams = App.getRouter().getSearch();

      let params: WinnersRequestParams;
      const { sort } = searchParams;

      if (sort === sortParam) {
        let order: OrderParam;
        if (searchParams.order === OrderParam.ASC) {
          order = OrderParam.DESC;
        } else {
          order = OrderParam.ASC;
        }
        params = { sort, order };
      } else {
        params = {
          sort: sortParam,
          order: OrderParam.ASC,
        };
      }

      Router.push(Actions.Winners, [WinnersView.getPage()], params);
    };

  static refresh() {
    new WinnersList();
    GarageHeading.refresh();
  }
}

export default WinnersList;
