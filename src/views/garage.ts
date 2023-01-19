import Header from '../components/header';
import GarageMain from '../components/garage-main';
import View from '../lib/view';
import Loader from '../components/loader';
import Popup from '../components/popup';

class GarageView extends View {
  constructor(page?: number) {
    super('Garage');
    if (page !== undefined) {
      this.page = page;
    }
  }

  build(): void {
    this.$container.append(
      new Header().element(),
      new GarageMain().element(),
      new Loader().element(),
      new Popup().element(),
    );
  }
}

export default GarageView;
