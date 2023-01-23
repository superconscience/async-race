import { OrderParam, WinnersSortParam } from '../lib/api-client';
import App from '../lib/app';
import Controller from '../lib/controller';
import CarModel from '../models/car';
import WinnerModel from '../models/winner';
import { Actions } from '../types';
import GarageView, { GarageViewState } from '../views/garage';
import WinnersView, { WinnersViewState } from '../views/winners';

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
    const action = App.getRouter().getAction();
    const params = this.getParams();
    const page = Number(params[0]);
    let garageViewState: GarageViewState;
    let winnersViewState: WinnersViewState;
    const searchParams = App.getRouter().getSearch();
    if (page) {
      garageViewState = action === Actions.Garage ? { page } : GarageView.stateHistory.current;
      winnersViewState = action === Actions.Winners
        ? {
          page,
          sort: searchParams.sort as WinnersSortParam.Id,
          order: searchParams.order as OrderParam.ASC,
        }
        : WinnersView.stateHistory.current;
    } else {
      garageViewState = GarageView.stateHistory.current;
      winnersViewState = WinnersView.stateHistory.current;
    }
    this.garageView = new GarageView(garageViewState);
    this.winnersView = new WinnersView(winnersViewState);
    this.carModel = new CarModel(App.getStore(), App.getApiClient());
    this.winnerModel = new WinnerModel(
      App.getStore().winners,
      App.getApiClient(),
    );
  }

  async garage(): Promise<void> {
    await Promise.all([
      await this.carModel.fetchCars(GarageView.getPage()),
      await this.winnerModel.fetchAllWinners(),
    ]);
    this.garageView.render();
  }

  async winners(): Promise<void> {
    await Promise.all([
      await this.carModel.fetchAllCars(),
      await this.winnerModel.fetchWinners(WinnersView.getPage(), App.getRouter().getSearch()),
      await this.winnerModel.fetchAllWinners(),
    ]);
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
