import config from '../config/config';
import { Actions } from '../types';

class Router {
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
    const uri = window.location.href.replace(window.location.origin, '').slice(1);

    this.uri = uri.trim();

    // Get defaults
    this.route = config.defaultRoute;
    this.controller = config.defaultController;
    this.action = config.defaultAction;
    this.params = [];

    const uriParts = this.uri.split('?');

    // Get path like /action/param1/param2
    const path = uriParts[0];

    const pathParts = path.split('/');
    if (pathParts.length > 0) {
      // Get action
      if (pathParts[0]) {
        this.action = pathParts[0].toLowerCase();
        pathParts.shift();
      }

      // Get params - all the rest
      this.params = pathParts;
    }
  }

  static redirect(location: string): void {
    window.location.href = location;
  }

  static createLink(action: Actions, params?: (string | number)[]): string {
    return `/${action}/${params ? params.map(String).join('/') : ''}`;
  }
}

export default Router;
