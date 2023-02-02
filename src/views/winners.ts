import Footer from '../components/footer';
import Header from '../components/header';
import WinnersMain from '../components/winners-main';
import { OrderParam, WinnersSortParam } from '../lib/api-client';
import View from '../lib/view';

export type WinnersViewState = {
  page: number;
  sort: WinnersSortParam;
  order: OrderParam;
};

export type WinnersViewStateHistory = {
  prev: WinnersViewState;
  current: WinnersViewState;
};

class WinnersView extends View {
  static stateHistory: WinnersViewStateHistory = {
    prev: {
      page: 1,
      sort: WinnersSortParam.Id,
      order: OrderParam.ASC,
    },
    current: {
      page: 1,
      sort: WinnersSortParam.Id,
      order: OrderParam.ASC,
    },
  };

  constructor(state: WinnersViewState) {
    super('Winners');
    WinnersView.stateHistory.prev = WinnersView.stateHistory.current;
    WinnersView.stateHistory.current = state;
    WinnersView.page = WinnersView.stateHistory.current.page;
  }

  build(): void {
    this.$container.append(
      new Header().element(),
      new WinnersMain().element(),
      new Footer().element(),
    );
  }

  static getPage(): number {
    return WinnersView.page;
  }
}

export default WinnersView;
