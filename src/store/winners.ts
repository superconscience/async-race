import { WINNERS_PER_PAGE } from '../constants';
import App from '../lib/app';
import {
  Car, CarId, Winner, Winners,
} from '../types';

class WinnersStore {
  currentWinner: Car | null = null;

  winners: Winners = [];

  allWinners: Winners = [];

  _isSavingWinners = false;

  private totalCount = 0;

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

  getTotalPages(): number {
    return Math.ceil(this.totalCount / WINNERS_PER_PAGE) || 1;
  }

  getTotalCount(): number {
    return this.totalCount;
  }

  setTotalCount(value: number): void {
    this.totalCount = value;
  }
}

export default WinnersStore;
