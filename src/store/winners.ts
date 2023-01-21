import App from '../lib/app';
import {
  Car, CarId, Winner, Winners,
} from '../types';

class WinnersStore {
  currentWinner: Car | null = null;

  winners: Winners = [];

  _isSavingWinners = false;

  get isSavingWinners(): boolean {
    return this._isSavingWinners;
  }

  set isSavingWinners(value: boolean) {
    this._isSavingWinners = value;
    App.getController().getGarageView().toggleSavingWinnersStatus(value);
  }

  resetCurrentWinner(): void {
    this.currentWinner = null;
  }

  getWinnerByCarId(id: CarId): Winner | undefined {
    return this.winners.find((x) => x.id === id);
  }
}

export default WinnersStore;
