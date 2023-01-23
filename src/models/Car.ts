import ApiClient,
{
  DriveResponseData, ResponseHeaders, SetEngineResponseData, SetEngineStatus,
} from '../lib/api-client';
import App from '../lib/app';
import { ResponseCallback } from '../lib/http';
import Store from '../lib/store';
import {
  Car, CarId, CreateCarRequestData, EngineStatus, RaceStatus,
} from '../types';
import { createWinner, generateCars } from '../utils/functions';

class CarModel {
  store: Store;

  client: ApiClient;

  constructor(store: Store, client: ApiClient) {
    this.store = store;
    this.client = client;
  }

  async fetchCars(page = 1): Promise<void> {
    const cars = await this.client.getCars(page, this.getTotalCountCallback);
    this.store.cars.setCars(cars);
  }

  async fetchAllCars(): Promise<void> {
    const cars = await this.client.getCars();
    this.store.cars.allCars = cars;
  }

  async createCar(data: CreateCarRequestData, page: number): Promise<void> {
    await this.client.createCar(data);
    await this.fetchCars(page);
  }

  async updateCar(id: CarId, data: CreateCarRequestData): Promise<Car> {
    await this.client.updateCar(id, data);
    return this.client.getCar(id);
  }

  async deleteCar(id: CarId, page: number): Promise<void> {
    await this.client.deleteCar(id);
    await App.getController().getWinnerModel().deleteWInner(id);
    await this.fetchCars(page);
  }

  async generateCars(page: number): Promise<void> {
    await Promise.all(generateCars().map(async (car) => {
      this.client.createCar(car);
    }));
    await this.fetchCars(page);
  }

  async setEngine(id: CarId, status: SetEngineStatus): Promise<SetEngineResponseData> {
    const engineData = this.client.setEngine(id, status);
    if (status === EngineStatus.Started) {
      this.store.cars.addRacingCar(id);
    } else if (status === EngineStatus.Stopped) {
      this.store.cars.removeRacingCar(id);
    }
    return engineData;
  }

  async drive(id: CarId): Promise<DriveResponseData | void> {
    const driveData = await this.client.drive(id).catch((error) => {
      this.store.cars.removeRacingCar(id);
      throw error;
    });
    return driveData;
  }

  async finish(id: CarId): Promise<{ car: Car, time: number } | null> {
    const { cars: carsStore, winners: winnersStore } = this.store;

    if (carsStore.isSoloRace) {
      carsStore.removeRacingCar(id);
      return null;
    }

    const winnerModel = App.getController().getWinnerModel();
    const resultTime = (Date.now() - carsStore.raceTimer) / 1000;
    const isWinner = Object.keys(carsStore.raceResults).length === 0;
    const car = carsStore.carsMap[id];
    const afterSavingWinner = () => {
      winnersStore.isSavingWinners = false;
    };

    carsStore.addRaceResult(id, resultTime);

    const sameWinner = winnersStore.getWinnerByCarId(id);

    if (isWinner) {
      winnersStore.isSavingWinners = true;
      carsStore.raceStatus = RaceStatus.HasWinner;
      if (sameWinner) {
        winnerModel
          .updateWinner(
            id,
            { time: Math.min(resultTime, sameWinner.time), wins: sameWinner.wins + 1 },
          )
          .finally(afterSavingWinner);
      } else {
        winnerModel.createWinner(createWinner(id, 1, resultTime))
          .finally(afterSavingWinner);
      }

      winnersStore.currentWinner = car;
    }

    carsStore.removeRacingCar(id);

    return isWinner ? { car, time: resultTime } : null;
  }

  private getTotalCountCallback: ResponseCallback = (response) => {
    const totalCount = response.headers.get(ResponseHeaders.XTotalCount);
    if (totalCount) {
      this.store.cars.setTotalCount(Number(totalCount));
    }
  };
}

export default CarModel;
