abstract class Component<T extends HTMLElement = HTMLElement> {
  abstract element(): T;
}

export default Component;
