import config from '../config/config';
import { Actions } from '../types';
import App from './app';

export type RouterState = {
  url: string;
};

export type UrlParams = (string | number)[];

class Router {
  protected static state: RouterState = Router.createState(window.location.href);

  protected uri: string;

  protected controller: string;

  protected action: string;

  protected params: string[];

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

  static push(action: Actions, params?: UrlParams): void {
    const route = Router.createLink(action, params);
    window.history.pushState(Router.createState(route), '', route);
    App.run();
  }

  static redirect(location: string): void {
    window.location.href = location;
  }

  static createLink(action: Actions, params?: UrlParams): string {
    return `/${action}/${params ? params.map(String).join('/') : ''}`;
  }
}

export default Router;
