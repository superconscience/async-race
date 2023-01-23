import { CARS_PER_PAGE, WINNERS_PER_PAGE } from '../constants';
import {
  Car, CarId, Cars, CreateCarRequestData, CreateWinnerRequestData,
  EngineStatus, UpdateWinnerRequestData, Winner, Winners as WinnersType,
} from '../types';
import Http, { ResponseCallback } from './http';
import Router, { RouterSearch } from './router';

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

export enum WinnersSortParam {
  Id = 'id',
  Wins = 'wins',
  Time = 'time',
}

export enum OrderParam {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type WinnersRequestParams = {
  sort: WinnersSortParam,
  order: OrderParam,
};

class ApiClient {
  private baseUrl = 'http://127.0.0.1:3000';

  private http: Http = new Http(this.baseUrl);

  getCars(page?: number, callback?: ResponseCallback): Promise<Cars> {
    let endpoint = `${Endpoints.Garage}`;
    if (page !== undefined) {
      endpoint += `?_page=${page}&_limit=${CARS_PER_PAGE}`;
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

  getWinners(
    page?: number,
    callback?: ResponseCallback,
    params?: RouterSearch,
  ): Promise<WinnersType> {
    let endpoint = `${Endpoints.Winners}`;
    const paramsStr = params ? Router.strinfifySearch(params.sort === WinnersSortParam.Id ? {} : params) : '';

    if (page !== undefined) {
      endpoint += `?_page=${page}&_limit=${WINNERS_PER_PAGE}&${paramsStr}`;
    } else {
      endpoint += `?${paramsStr}`;
    }

    return this.http.get<WinnersType>(endpoint, undefined, callback);
  }

  createWinner(data: CreateWinnerRequestData): Promise<Winner> {
    return this.http.post<Winner>(Endpoints.Winners, data);
  }

  updateWinner(id: CarId, data: UpdateWinnerRequestData): Promise<Winner> {
    return this.http.put<Winner>(`${Endpoints.Winners}/${id}`, data);
  }

  async deleteWinner(id: CarId) : Promise<void> {
    await this.http.delete(`${Endpoints.Winners}/${id}`);
  }
}

export default ApiClient;
