import { CARS_PER_PAGE } from '../constants';
import {
  Car, CarId, Cars, CarsMap, RaceResults, RaceStatus,
} from '../types';

class CarsStore {
  private _cars: Cars = [];

  allCars: Cars = [];

  private _racingCars: CarId[] = [];

  private _raceResults: RaceResults = {};

  private totalCount = 0;

  isSoloRace = false;

  raceTimer = 0;

  raceStatus: RaceStatus = RaceStatus.Idle;

  get cars(): Cars {
    return this._cars;
  }

  set cars(value: Cars) {
    this._cars = value;
  }

  get carsMap(): CarsMap {
    return Object.fromEntries(this._cars.map((car) => [car.id, car]));
  }

  get racingCars(): CarId[] {
    return this._racingCars;
  }

  get raceResults(): RaceResults {
    return this._raceResults;
  }

  addRacingCar(id: CarId): void {
    if (this._racingCars.length === 0) {
      this.raceStatus = this.isSoloRace ? RaceStatus.SoloStarted : RaceStatus.Started;
    }
    this._racingCars.push(id);
  }

  removeRacingCar(id: CarId): void {
    this._racingCars = this._racingCars.filter((_id) => _id !== id);
    if (this._racingCars.length === 0) {
      this.raceStatus = this.isSoloRace ? RaceStatus.SoloFinished : RaceStatus.Idle;
    }
  }

  get isSomeCarRacing(): boolean {
    return this._racingCars.length > 0;
  }

  getTotalCount(): number {
    return this.totalCount;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalCount / CARS_PER_PAGE) || 1;
  }

  setTotalCount(value: number): void {
    this.totalCount = value;
  }

  addRaceResult(key: keyof RaceResults, value: RaceResults[typeof key]): void {
    this._raceResults[key] = value;
  }

  resetRace(): void {
    this._raceResults = {};
    this.raceTimer = 0;
    this._racingCars = [];
    this.raceStatus = RaceStatus.Idle;
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
}

export default CarsStore;
