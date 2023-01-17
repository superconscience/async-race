import Header from '../components/header';
import GarageMain from '../components/garage-main';
import View from '../lib/view';
import Loader from '../components/loader';

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
    );
  }
}

export default GarageView;
