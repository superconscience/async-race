import Footer from '../components/footer';
import GarageItem from '../components/garage-item';
import GarageMain from '../components/garage-main';
import Header from '../components/header';
import Loader from '../components/loader';
import Popup from '../components/popup';
import StatusBox from '../components/status-box';
import View from '../lib/view';

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

// {[page]: [HTMLInputElement, ...]}
export type GarageViewInputState = Record<string, HTMLInputElement[]>;

// {[page]: [true, false,...]} if true then item is shown, otherwise hidden
export type GarageViewUpdateItemsShownState = Record<string, boolean[]>;

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

  static inputState: GarageViewInputState = {};

  static updateItemsShownState: GarageViewUpdateItemsShownState = {};

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
    this.restoreInputState();
  }

  toggleSavingWinnersStatus(toggle: boolean): void {
    this.status = toggle ? GarageViewStatus.SavingWinners : GarageViewStatus.Idle;
    StatusBox.setMessage(toggle ? GarageView.statusMessages.savingWinners : '');
  }

  restoreInputState(): void {
    const { page } = GarageView;
    if (!GarageView.inputState[page]) {
      return;
    }

    const $currentInputs = [...this.$container.querySelectorAll('input')];

    GarageView.inputState[page].forEach(($prevInput, index) => {
      if ($currentInputs[index]) {
        $currentInputs[index].value = $prevInput.value;
      }
    });

    if (!GarageView.updateItemsShownState[page]) {
      return;
    }

    const $currentGarageItems = [
      ...this.$container.querySelectorAll(`.${GarageItem.classes.garageItem}`),
    ];

    GarageView.updateItemsShownState[page].forEach((toggle, index) => {
      if ($currentGarageItems[index]) {
        $currentGarageItems[index].classList.toggle(GarageItem.classes.garageItemUpdate, toggle);
      }
    });
  }

  static getPage(): number {
    return GarageView.page;
  }
}

export default GarageView;
