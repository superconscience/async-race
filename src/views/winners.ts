import Header from '../components/header';
import View from '../lib/view';

class WinnersView extends View {
  constructor(page?: number) {
    super('Winners');
    if (page !== undefined) {
      WinnersView.page = page;
    }
  }

  build(): void {
    this.$container.append(new Header().element());
  }

  static getPage(): number {
    return WinnersView.page;
  }
}

export default WinnersView;
