import Controller from '../lib/controller';
import GarageView from '../views/garage';
import WinnersView from '../views/winners';

class MainController extends Controller {
  private garageView = new GarageView();

  private winnersView = new WinnersView();

  getGarageView(): GarageView {
    return this.garageView;
  }

  getWinnersView(): WinnersView {
    return this.winnersView;
  }

  constructor() {
    super();
  }

  garage(): void {
    this.garageView.render();
  }

  winners(): void {
    this.winnersView.render();
  }

  error(): void {
    console.error('error');
  }
}

export default MainController;
