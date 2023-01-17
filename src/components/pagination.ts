import App from '../lib/app';
import Component from '../lib/component';
import Router from '../lib/router';
import { Actions } from '../types';
import { $ } from '../utils/functions';

class Pagination extends Component<HTMLUListElement> {
  limit: number;

  private $element: HTMLUListElement;

  static readonly classes = {
    pagination: 'pagination',
    item: 'pagination__item',
    itemEmpty: 'pagination__item_empty',
    link: 'pagination__link',
  };

  constructor(limit: number) {
    super();
    this.limit = limit;
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
    const listItemsCount = App.getStore().cars.getTotalCount();
    const currentPage = App.getController().getGarageView().getPage();
    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;
    const pagesCount = Math.ceil(listItemsCount / this.limit) || 1;
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
    const href = isDisabled ? '' : Router.createLink(Actions.Garage, [page]);
    let className = Pagination.classes.link;
    if (isDisabled) {
      className += ' disabled';
    }
    $item.innerHTML = `<a href = "${href}" class="${className}">${text}</a>`;

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
