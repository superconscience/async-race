import ApiClient from '../lib/api-client';
import WinnersStore from '../store/winners';
import {
  CarId, CreateWinnerRequestData, UpdateWinnerRequestData, Winner,
} from '../types';

class WinnerModel {
  store: WinnersStore;

  client: ApiClient;

  constructor(store: WinnersStore, client: ApiClient) {
    this.store = store;
    this.client = client;
  }

  async fetchWinners(): Promise<void> {
    const winners = await this.client.getWinners();
    this.store.winners = winners;
  }

  async createWinner(data: CreateWinnerRequestData): Promise<Winner> {
    const winner = await this.client.createWinner(data);
    await this.fetchWinners();
    return winner;
  }

  async updateWinner(id: CarId, data: UpdateWinnerRequestData) {
    const winner = await this.client.updateWinner(id, data);
    await this.fetchWinners();
    return winner;
  }
}

export default WinnerModel;
