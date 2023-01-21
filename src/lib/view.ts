abstract class View {
  private $root: HTMLElement | null = document.getElementById('root');

  protected $container = document.createDocumentFragment();

  protected static page = 1;

  private name: string;

  getName(): string {
    return this.name;
  }

  constructor(name: string) {
    this.name = name;
  }

  render(): void {
    if (!this.$root) {
      throw new Error('Root element not found in index.html');
    }
    this.build();
    this.$root.innerHTML = '';
    this.$root.append(this.$container);
  }

  abstract build(): void;
}

export default View;
