import {
  Car, CarId, Cars, CreateCarRequestData,
} from '../types';
import Http, { Endpoints } from './http';

class ApiClient {
  private baseUrl = 'http://127.0.0.1:3000';

  private http: Http = new Http(this.baseUrl);

  getCars(): Promise<Cars> {
    return this.http.get<Cars>(Endpoints.Garage);
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
}

export default ApiClient;
