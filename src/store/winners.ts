import {
  Car, CarId, Winner, Winners,
} from '../types';

class WinnersStore {
  currentWinner: Car | null = null;

  winners: Winners = [];

  resetCurrentWinner(): void {
    this.currentWinner = null;
  }

  getWinnerByCarId(id: CarId): Winner | undefined {
    return this.winners.find((x) => x.id === id);
  }
}

export default WinnersStore;
