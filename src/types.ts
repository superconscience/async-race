export interface Configs {
  siteName: string;
  defaultRoute: string;
  defaultController: string;
  defaultAction: string;
}

export type ConfigsKey = keyof Configs;

export enum Actions {
  Garage = 'garage',
  Winners = 'winners',
}

export interface Car {
  id: CarId;
  name: string;
  color: string;
}

export type CreateCarRequestData = Omit<Car, 'id'>;

export type CarId = string;

export type Cars = Car[];

export type CarsMap = Record<string, Car>;

export interface Component<T extends HTMLElement = HTMLElement> {
  element: () => T;
}

export enum ErrorNames {
  PopupError = 'PopupError',
}
