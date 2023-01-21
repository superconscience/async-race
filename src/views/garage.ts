import Header from '../components/header';
import GarageMain from '../components/garage-main';
import View from '../lib/view';
import Loader from '../components/loader';
import Popup from '../components/popup';
import StatusBox from '../components/status-box';

export enum GarageViewStatus {
  Idle = 'Idle',
  SavingWinners = 'SavingWinners',
}

class GarageView extends View {
  private _status: GarageViewStatus = GarageViewStatus.Idle;

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

  constructor(page?: number) {
    super('Garage');
    if (page !== undefined) {
      GarageView.page = page;
    }
  }

  build(): void {
    this.$container.append(
      new Header().element(),
      new GarageMain().element(),
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
