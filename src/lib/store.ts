import CarsStore from '../store/cars';
import WinnersStore from '../store/winners';

class Store {
  private static instance: Store;

  cars: CarsStore;

  winners: WinnersStore;

  private constructor() {
    this.cars = new CarsStore();
    this.winners = new WinnersStore();
    Store.instance = this;
  }

  static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }
}

export default Store;
