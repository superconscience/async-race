import ApiClient, { ResponseHeaders } from '../lib/api-client';
import { ResponseCallback } from '../lib/http';
import CarsStore from '../store/cars';
import { CarId, CreateCarRequestData } from '../types';
import { generateCars } from '../utils/functions';

class CarModel {
  store: CarsStore;

  client: ApiClient;

  constructor(store: CarsStore, client: ApiClient) {
    this.store = store;
    this.client = client;
  }

  async fetchCars(page = 1): Promise<void> {
    const cars = await this.client.getCars(page, this.getTotalCountCallback);
    this.store.setCars(cars);
  }

  async createCar(data: CreateCarRequestData, page: number): Promise<void> {
    await this.client.createCar(data);
    await this.fetchCars(page);
  }

  async updateCar(id: CarId, data: CreateCarRequestData) {
    await this.client.updateCar(id, data);
    return this.client.getCar(id);
  }

  async deleteCar(id: CarId, page: number) {
    await this.client.deleteCar(id);
    await this.fetchCars(page);
  }

  async generateCars(page: number) {
    await Promise.all(generateCars().map(async (car) => {
      this.client.createCar(car);
    }));
    await this.fetchCars(page);
  }

  private getTotalCountCallback: ResponseCallback = (response) => {
    const totalCount = response.headers.get(ResponseHeaders.XTotalCount);
    if (totalCount) {
      this.store.setTotalCount(Number(totalCount));
    }
  };
}

export default CarModel;
