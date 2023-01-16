import { CreateCarRequestData } from '../types';

export enum Endpoints {
  Garage = 'garage',
  Winners = 'winners',
  Engine = 'engine',
}

export type HttpOptions<O extends keyof RequestInit = 'method'> = Omit<RequestInit, O | 'method'>;

class Http {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get<T = unknown>(endpoint: string, options: HttpOptions = {}): Promise<T> {
    return this.fetch(
      endpoint,
      options,
    ).then((response) => response.json() as T);
  }

  async post<T = unknown>(endpoint: string, data: unknown, options: HttpOptions<'body'> = {}): Promise<T> | never {
    const response = await this.fetch(
      endpoint,
      {
        ...options,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
    );
    return response.json() as Promise<T>;
  }

  async put<T = unknown>(endpoint: string, data: CreateCarRequestData, options: HttpOptions<'body'> = {}): Promise<T> | never {
    const response = await this.fetch(
      endpoint,
      {
        ...options,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
    );
    return response.json() as Promise<T>;
  }

  async delete(endpoint: string, options: HttpOptions = {}): Promise<void> {
    this.fetch(endpoint, { ...options, method: 'DELETE' });
  }

  private fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    return fetch(`${this.baseUrl}/${endpoint}`, options)
      .then((response) => this.errorHandler(response));
  }

  private errorHandler(response: Response): Response | never {
    if ([400, 404, 429, 500].includes(Number(response.status))) {
      console.error(response);
      throw new Error(response.statusText);
    }
    return response;
  }
}

export default Http;
