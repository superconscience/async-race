import { Component } from '../types';
import { $ } from '../utils/functions';
import ConstructorItem from './constructor-item';

export type ConstructorMode = 'create' | 'update';

class ConstructorPanel implements Component {
  $element: HTMLElement;

  static readonly classes = {
    constructor: 'constructor',
    list: 'constructor__list',
    listItem: 'constructor__list-item',
    item: 'constructor__item',
    input: 'constructor__input',
    color: 'constructor__color',
    createBtn: 'constructor__create',
    updateBtn: 'constructor__update',
  };

  constructor() {
    this.$element = this.create();
  }

  element(): HTMLElement {
    return this.$element;
  }

  create(): HTMLElement {
    const $container = $('div', ConstructorPanel.classes.constructor);
    const $list = $('ul', ConstructorPanel.classes.list);
    const $createListItem = $('li', ConstructorPanel.classes.listItem);
    const $createItem = new ConstructorItem('create', undefined).element();

    $container.append($list);
    $list.append($createListItem);
    $createListItem.append($createItem);

    return $container;
  }
}

export default ConstructorPanel;
