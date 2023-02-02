import ApiClient, { OrderParam, ResponseHeaders, WinnersSortParam } from '../lib/api-client';
import { ResponseCallback } from '../lib/http';
import { RouterSearch } from '../lib/router';
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

  async fetchWinners(page?: number, params?: RouterSearch): Promise<void> {
    const isSortById = params && params.sort === WinnersSortParam.Id;
    const isOrderDesc = isSortById && params.order === OrderParam.DESC;
    const winners = await this.client.getWinners(
      page, this.getTotalCountCallback, isSortById ? undefined : params);

    this.store.winners = isOrderDesc ? winners.reverse() : winners;
  }

  async fetchAllWinners(): Promise<void> {
    const winners = await this.client.getWinners();
    this.store.allWinners = winners;
  }

  async createWinner(data: CreateWinnerRequestData): Promise<Winner> {
    const winner = await this.client.createWinner(data);
    await this.fetchWinners();
    return winner;
  }

  async updateWinner(id: CarId, data: UpdateWinnerRequestData): Promise<Winner> {
    const winner = await this.client.updateWinner(id, data);
    await this.fetchWinners();
    return winner;
  }

  async deleteWInner(id: CarId): Promise<void> {
    return this.client.deleteWinner(id);
  }

  private getTotalCountCallback: ResponseCallback = (response) => {
    const totalCount = response.headers.get(ResponseHeaders.XTotalCount);
    if (totalCount) {
      this.store.setTotalCount(Number(totalCount));
    }
  };
}

export default WinnerModel;
