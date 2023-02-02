import ConstructorItem from '../components/constructor-item';
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

export type GarageViewEditorState = { name: string, color: string };

// {[cardId]: GarageViewEditorState}
export type GarageViewUpdateState = Record<string, GarageViewEditorState & { toggle: boolean }>;

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

  static createEditorState: GarageViewEditorState;

  static updateEditorsState: GarageViewUpdateState;

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
    if (!GarageView.createEditorState) {
      return;
    }

    const $nameInputCreate = this.$container.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.nameInputCreate}`);
    const $colorInputCreate = this.$container.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.colorInputCreate}`);

    if ($nameInputCreate) {
      $nameInputCreate.value = GarageView.createEditorState.name;
    }
    if ($colorInputCreate) {
      $colorInputCreate.value = GarageView.createEditorState.color;
    }

    if (!GarageView.updateEditorsState) {
      return;
    }

    [...this.$container.querySelectorAll<HTMLElement>(`.${GarageItem.classes.garageItem}`)]
      .forEach(($item) => {
        const { carId } = $item.dataset;

        if (carId === undefined || GarageView.updateEditorsState[carId] === undefined) {
          return;
        }

        const state = GarageView.updateEditorsState[carId];
        const $nameInput = $item.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.nameInputUpdate}`);
        const $colorInput = $item.querySelector<HTMLInputElement>(`.${ConstructorItem.classes.colorInputUpdate}`);

        $item.classList.toggle(GarageItem.classes.garageItemUpdate, state.toggle);
        if ($nameInput) {
          $nameInput.value = state.name;
        }

        if ($colorInput) {
          $colorInput.value = state.color;
        }
      });
  }

  static getPage(): number {
    return GarageView.page;
  }
}

export default GarageView;
