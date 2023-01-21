import App from '../lib/app';
import Controller from '../lib/controller';
import CarModel from '../models/car';
import WinnerModel from '../models/winner';
import GarageView from '../views/garage';
import WinnersView from '../views/winners';

class MainController extends Controller {
  private garageView: GarageView;

  private winnersView: WinnersView;

  private carModel: CarModel;

  private winnerModel: WinnerModel;

  getGarageView(): GarageView {
    return this.garageView;
  }

  getWinnersView(): WinnersView {
    return this.winnersView;
  }

  getCarModel(): CarModel {
    return this.carModel;
  }

  getWinnerModel(): WinnerModel {
    return this.winnerModel;
  }

  constructor() {
    super();
    this.garageView = new GarageView(this.getPage());
    this.winnersView = new WinnersView();
    this.carModel = new CarModel(App.getStore(), App.getApiClient());
    this.winnerModel = new WinnerModel(App.getStore().winners, App.getApiClient());
  }

  async garage(): Promise<void> {
    await this.carModel.fetchCars(this.getPage());

    this.garageView.render();
    console.log(App.getStore());
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
