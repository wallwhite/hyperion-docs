import { ERROR_CODES } from '../constants';
import { ModalError } from './modal.error';

export class ModalProviderNotFoundError extends ModalError {
  constructor() {
    super(
      'Make sure your component is rendered through the modal launcher system and within the context provider.',
      ERROR_CODES.PROVIDER_NOT_FOUND,
    );
  }
}
