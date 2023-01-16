import { GENERATE_CARS_COUNT } from '../constants';
import {
  Car, CarId, Cars, CarsMap,
} from '../types';
import { createCar } from '../utils/functions';

class CarsStore {
  private _cars: Cars = [];

  get cars(): Cars {
    return this._cars;
  }

  set cars(value: Cars) {
    this._cars = value;
  }

  get carsMap(): CarsMap {
    return Object.fromEntries(this.cars.map((car) => [car.id, car]));
  }

  addCar(value: Car): void {
    this.cars = [...this.cars, value];
  }

  updateCar(id: CarId, value: Car): void {
    this.carsMap[id].name = value.name;
    this.carsMap[id].color = value.color;
  }

  setCars(value: Cars): void {
    this.cars = value;
  }

  deleteCar(id: CarId): void {
    this.cars = this.cars.filter((car) => car.id !== id);
  }

  nameExists(name: string): boolean {
    return this.cars.filter((car) => car.name === name).length > 0;
  }

  generateCars() {
    const newCars = Array(GENERATE_CARS_COUNT).fill(0).map((_, i) => createCar(`Car-${i + 1}`, '#aaffcc'));
    this.cars = this.cars.concat(newCars);
  }
}

export default CarsStore;
