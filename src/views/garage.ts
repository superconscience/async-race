import Header from '../components/header';
import GarageMain from '../components/garage-main';
import View from '../lib/view';

class GarageView extends View {
  constructor() {
    super('Garage');
  }

  build(): void {
    this.$container.append(new Header().element(), new GarageMain().element());
  }
}

export default GarageView;
