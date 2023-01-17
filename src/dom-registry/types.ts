export type DOMRegistry = {
  createCarNameInput: HTMLInputElement | null;
  createCarColorInput: HTMLInputElement | null;
  updateCarNameInput: HTMLInputElement | null;
  updateCarColorInput: HTMLInputElement | null;
  carList: HTMLElement | null;
  carListItems: Record<string, HTMLElement> | null;
};

export type DOMRegistryKey = keyof DOMRegistry;
