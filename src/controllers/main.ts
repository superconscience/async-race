import App from '../lib/app';
import Controller from '../lib/controller';
import CarModel from '../models/Car';
import GarageView from '../views/garage';
import WinnersView from '../views/winners';

class MainController extends Controller {
  private garageView = new GarageView(this.getPage());

  private winnersView = new WinnersView();

  private carModel: CarModel = new CarModel(App.getStore().cars, App.getApiClient());

  getGarageView(): GarageView {
    return this.garageView;
  }

  getWinnersView(): WinnersView {
    return this.winnersView;
  }

  getCarModel(): CarModel {
    return this.carModel;
  }

  constructor() {
    super();
  }

  async garage(): Promise<void> {
    await this.carModel.fetchCars(this.getPage());

    this.garageView.render();
  }

  winners(): void {
    this.winnersView.render();
  }

  error(): void {
    console.error('error');
  }

  private getPage(): number {
    return Number(this.params[0]) || 1;
  }
}

export default MainController;
