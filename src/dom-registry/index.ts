import { DOMRegistry as DOMRegistryType } from './types';

class DOMRegistry {
  static items: DOMRegistryType = {
    createCarNameInput: null,
    createCarColorInput: null,
    updateCarNameInput: null,
    updateCarColorInput: null,
    carList: null,
    carListItems: null,
  };
}

export default DOMRegistry;
