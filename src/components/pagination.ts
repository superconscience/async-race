import App from '../lib/app';
import Component from '../lib/component';
import Router from '../lib/router';
import { Actions } from '../types';
import { $ } from '../utils/functions';
import Button from './button';

class Pagination extends Component<HTMLUListElement> {
  limit: number;

  count: number;

  currentPage: number;

  action: Actions;

  private $element: HTMLUListElement;

  static readonly classes = {
    pagination: 'pagination',
    item: 'pagination__item',
    itemEmpty: 'pagination__item_empty',
    itemActive: 'pagination__item_active',
    link: 'pagination__link',
  };

  constructor(limit: number, count: number, currentPage: number, action: Actions) {
    super();
    this.limit = limit;
    this.count = count;
    this.currentPage = currentPage;
    this.action = action;
    this.$element = this.create();
  }

  element(): HTMLUListElement {
    return this.$element;
  }

  create(): HTMLUListElement {
    return this.createPagination();
  }

  private createPagination(): HTMLUListElement {
    const $container = $('ul', Pagination.classes.pagination);
    const { currentPage } = this;
    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;
    const pagesCount = Math.ceil(this.count / this.limit) || 1;
    const pageNumbers = Array(pagesCount)
      .fill(0)
      .map((_, i) => i + 1)
      .slice(
        Math.max(currentPage - 6, 0),
        currentPage > 6 ? currentPage + 4 : 10,
      );

    const $prevItem = this.createPaginationItem(prevPage, pagesCount, '«');
    const $nextItem = this.createPaginationItem(nextPage, pagesCount, '»');

    $container.append($prevItem);

    if (pageNumbers[0] !== 1) {
      $container.append(
        this.createPaginationItem(1, pagesCount),
        this.createEmptyPaginationItem());
    }

    pageNumbers
      .forEach((page) => {
        $container.append(this.createPaginationItem(page, pagesCount));
      });

    if (pageNumbers[pageNumbers.length - 1] !== pagesCount) {
      $container.append(
        this.createEmptyPaginationItem(),
        this.createPaginationItem(pagesCount, pagesCount));
    }

    $container.append($nextItem);

    return $container;
  }

  private createPaginationItem(
    page: number,
    pagesCount: number,
    text: string = page.toString(),
  ): HTMLLIElement {
    const $item = $('li', Pagination.classes.item);
    const isDisabled = page <= 0 || page > pagesCount;
    let className = Pagination.classes.link;

    if (isDisabled) {
      className += ' disabled';
    }

    if (page === this.currentPage) {
      $item.classList.add(Pagination.classes.itemActive);
    }

    const $button = new Button(
      text, className, () => {
        if (!isDisabled) {
          Router.push(this.action, [page], App.getRouter().getSearch());
        }
      },
    ).element();

    $item.append($button);

    return $item;
  }

  private createEmptyPaginationItem() {
    const $item = $('li', Pagination.classes.item);
    $item.classList.add(Pagination.classes.itemEmpty);
    $item.textContent = '...';

    return $item;
  }
}

export default Pagination;
