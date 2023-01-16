import { ErrorNames } from '../types';

class PopupError extends Error {
  name: ErrorNames;

  constructor(message: string) {
    super(message);
    this.name = ErrorNames.PopupError;
  }
}

export default PopupError;
