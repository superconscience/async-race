import config from '../config/config';
import { Actions, CustomEvents } from '../types';
import App from './app';

export type RouterState = {
  url: string;
};

export type RouterSearch = Record<string, string>;

export type UrlParams = (string | number)[];

class Router {
  protected static state: RouterState = Router.createState(window.location.href);

  protected uri: string;

  protected controller: string;

  protected action: string;

  protected params: string[];

  protected search: RouterSearch = {};

  protected route: string;

  public getUri(): string {
    return this.uri;
  }

  getController(): string {
    return this.controller;
  }

  getAction(): string {
    return this.action;
  }

  getParams(): string[] {
    return this.params;
  }

  getRoute(): string {
    return this.route;
  }

  getSearch(): RouterSearch {
    return this.search;
  }

  constructor() {
    const { url } = window.history.state;

    if (typeof url !== 'string') {
      throw new Error('Something went wrong');
    }
    this.uri = url.trim();

    // Get defaults
    this.route = config.defaultRoute;
    this.controller = config.defaultController;
    this.action = config.defaultAction;
    this.params = [];

    const uriParts = this.uri.split('?');

    this.search = Router.parseSearch(uriParts[1]);

    // Get path like /action/param1/param2
    const path = uriParts[0];

    const pathParts = path.split('/');
    pathParts.shift();
    if (pathParts.length > 0) {
      // Get action
      if (pathParts[0]) {
        this.action = pathParts[0].toLowerCase();
        pathParts.shift();
      }

      // Get params - all the rest
      this.params = pathParts;
      if (this.params.length === 1 && this.params[0] === '') {
        this.params = [];
      }
    }
  }

  static createState(url: string): RouterState {
    return { url };
  }

  static push(action: Actions, params?: UrlParams, search?: RouterSearch): void {
    const beforeRouterPushEvent = new CustomEvent(
      CustomEvents.BEFOREROUTERPUSH,
      {
        detail: { action, params, search },
        bubbles: true,
      },
    );
    document.dispatchEvent(beforeRouterPushEvent);

    const route = Router.createLink(action, params, search);

    window.history.pushState(Router.createState(route), '', route);

    App.run();
  }

  static redirect(location: string): void {
    window.location.href = location;
  }

  static createLink(action: Actions, params?: UrlParams, search?: RouterSearch): string {
    const paramsStr = params ? params.map(String).join('/') : '';
    const searchStr = (search && Object.keys(search).length > 0) ? `?${Router.strinfifySearch(search)}` : '';
    return `/${action}/${paramsStr}${searchStr}`;
  }

  static parseSearch(input: string): RouterSearch {
    if (!input) {
      return {};
    }

    const search: RouterSearch = {};
    const parts = input.split('&');

    parts.forEach((part) => {
      if (part) {
        const [key, value] = part.split('=');

        if (key) {
          if (value) {
            search[key.slice(1)] = value;
          } else {
            search[key.slice(1)] = 'true';
          }
        }
      }
    });

    return search;
  }

  static strinfifySearch(search: RouterSearch): string {
    return Object.entries(search).map(([key, value]) => `_${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
  }
}

export default Router;
