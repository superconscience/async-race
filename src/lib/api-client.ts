import {
  Car, CarId, Cars, CreateCarRequestData, CreateWinnerRequestData,
  EngineStatus, UpdateWinnerRequestData, Winner, Winners as WinnersType,
} from '../types';
import Http, { ResponseCallback } from './http';

export enum Endpoints {
  Garage = 'garage',
  Winners = 'winners',
  Engine = 'engine',
}

export enum ResponseHeaders {
  XTotalCount = 'X-Total-Count',
}

export type SetEngineStatus = EngineStatus.Started | EngineStatus.Stopped;

export type SetEngineResponseData = {
  velocity: string,
  distance: string,
};

export type DriveResponseData = {
  success: boolean;
};

class ApiClient {
  private baseUrl = 'http://127.0.0.1:3000';

  private http: Http = new Http(this.baseUrl);

  getCars(page?: number, callback?: ResponseCallback): Promise<Cars> {
    let endpoint = `${Endpoints.Garage}`;
    if (page !== undefined) {
      endpoint += `?_page=${page}&_limit=7`;
    }
    return this.http.get<Cars>(endpoint, undefined, callback);
  }

  getCar(id: CarId): Promise<Car> {
    return this.http.get<Car>(`${Endpoints.Garage}/${id}`);
  }

  createCar(data: CreateCarRequestData): Promise<Car> {
    return this.http.post<Car>(Endpoints.Garage, data);
  }

  updateCar(id: CarId, data: CreateCarRequestData): Promise<Car> {
    return this.http.put<Car>(`${Endpoints.Garage}/${id}`, data);
  }

  deleteCar(id: CarId): Promise<void> {
    return this.http.delete(`${Endpoints.Garage}/${id}`);
  }

  setEngine(id: CarId, status: SetEngineStatus): Promise<SetEngineResponseData> {
    return this.http.patch<SetEngineResponseData>(`${Endpoints.Engine}?id=${id}&status=${status}`);
  }

  drive(id: CarId): Promise<DriveResponseData> {
    return this.http.patch<DriveResponseData>(`${Endpoints.Engine}?id=${id}&status=${EngineStatus.drive}`);
  }

  getWinners(): Promise<WinnersType> {
    return this.http.get<WinnersType>(Endpoints.Winners);
  }

  createWinner(data: CreateWinnerRequestData): Promise<Winner> {
    return this.http.post<Winner>(Endpoints.Winners, data);
  }

  updateWinner(id: CarId, data: UpdateWinnerRequestData): Promise<Winner> {
    return this.http.put<Winner>(`${Endpoints.Winners}/${id}`, data);
  }
}

export default ApiClient;
