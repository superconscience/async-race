import Header from '../components/header';
import View from '../lib/view';

class WinnersView extends View {
  constructor() {
    super('Winners');
  }

  build(): void {
    this.$container.append(new Header().element());
  }
}

export default WinnersView;
