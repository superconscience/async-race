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

export type RaceResults = Record<CarId, number>;

export type Winner = {
  id: CarId,
  wins: number,
  time: number,
};

export type Winners = Winner[];

export type CreateWinnerRequestData = Winner;

export type UpdateWinnerRequestData = Omit<Winner, 'id'>;

export enum EngineStatus {
  Started = 'started',
  Stopped = 'stopped',
  drive = 'drive',
}

export enum RaceStatus {
  Idle = 'idle',
  Started = 'started',
  HasWinner = 'hasWinner',
  SoloStarted = 'solo-started',
  SoloFinished = 'solo-finished',
}

export interface Component<T extends HTMLElement = HTMLElement> {
  element: () => T;
}

export enum ErrorNames {
  PopupError = 'PopupError',
}
