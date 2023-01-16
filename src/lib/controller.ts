import App from './app';

class Controller {
  protected params: string[];

  getParams(): string[] {
    return this.params;
  }

  constructor() {
    this.params = App.getRouter().getParams();
  }
}

export default Controller;
