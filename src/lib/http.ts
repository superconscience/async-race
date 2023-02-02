export type HttpOptions<O extends keyof RequestInit = 'method'> = Omit<RequestInit, O | 'method'>;

export type ResponseCallback = (response: Response) => void;

class Http {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get<T = unknown>(
    endpoint: string,
    options: HttpOptions = {},
    callback?: ResponseCallback,
  ): Promise<T> {
    return this.fetch(
      endpoint,
      options,
    )
      .then((response) => { if (callback) callback(response); return response; })
      .then((response) => response.json() as T);
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

  async put<T = unknown>(endpoint: string, data: unknown, options: HttpOptions<'body'> = {}): Promise<T> | never {
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

  async patch<T = unknown>(endpoint: string, options: HttpOptions = {}): Promise<T> | never {
    const response = await this.fetch(endpoint, { ...options, method: 'PATCH' });
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
    }
    return response;
  }
}

export default Http;
