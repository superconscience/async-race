import MainController from '../controllers/main';
import { Actions } from '../types';
import ApiClient from './api-client';
import Router from './router';
import Store from './store';

class App {
  private static router: Router;

  private static controller: MainController;

  private static store: Store;

  private static apiClient: ApiClient;

  static getRouter(): Router {
    return App.router;
  }

  static getController(): MainController {
    return App.controller;
  }

  static getStore(): Store {
    return App.store;
  }

  static getApiClient(): ApiClient {
    return App.apiClient;
  }

  static async run(): Promise<void> {
    App.router = new Router();
    App.store = new Store();
    App.apiClient = new ApiClient();
    App.controller = new MainController();

    const method = App.router.getAction().toLowerCase();

    try {
      if (method === Actions.Garage) {
        App.controller.garage();
      } else if (method === Actions.Winners) {
        App.controller.winners();
      }
    } catch (error) {
      App.controller.error();
    }
  }
}

export default App;
