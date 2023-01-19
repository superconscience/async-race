import CarsStore from '../store/cars';
import WinnersStore from '../store/winners';

class Store {
  cars: CarsStore = new CarsStore();

  winners: WinnersStore = new WinnersStore();
}

export default Store;
