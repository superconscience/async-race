import Header from '../components/header';
import GarageMain from '../components/garage-main';
import View from '../lib/view';
import Loader from '../components/loader';
import Popup from '../components/popup';
import StatusBox from '../components/status-box';
import Footer from '../components/footer';

export enum GarageViewStatus {
  Idle = 'Idle',
  SavingWinners = 'SavingWinners',
}

export type GarageViewState = {
  page: number;
};

export type GarageViewStateHistory = {
  prev: GarageViewState;
  current: GarageViewState;
};

class GarageView extends View {
  private _status: GarageViewStatus = GarageViewStatus.Idle;

  static stateHistory: GarageViewStateHistory = {
    prev: {
      page: 1,
    },
    current: {
      page: 1,
    },
  };

  static readonly classes = {
    statusSavingWinners: 'status_saving-winners',
  };

  static readonly statusMessages = {
    savingWinners: 'Saving (Winners)...',
  };

  get status(): GarageViewStatus {
    return this._status;
  }

  set status(value: GarageViewStatus) {
    this._status = value;
    document.body.classList.toggle(
      GarageView.classes.statusSavingWinners, value === GarageViewStatus.SavingWinners);
  }

  constructor(state: GarageViewState) {
    super('Garage');
    GarageView.stateHistory.prev = GarageView.stateHistory.current;
    GarageView.stateHistory.current = state;
    GarageView.page = GarageView.stateHistory.current.page;
  }

  build(): void {
    this.$container.append(
      new Header().element(),
      new GarageMain().element(),
      new Footer().element(),
      new Loader().element(),
      new Popup().element(),
      new StatusBox().element(),
    );
  }

  toggleSavingWinnersStatus(toggle: boolean): void {
    this.status = toggle ? GarageViewStatus.SavingWinners : GarageViewStatus.Idle;
    StatusBox.setMessage(toggle ? GarageView.statusMessages.savingWinners : '');
  }

  static getPage(): number {
    return GarageView.page;
  }
}

export default GarageView;
