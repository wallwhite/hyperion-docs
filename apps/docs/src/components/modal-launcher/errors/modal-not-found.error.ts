import { ERROR_CODES } from '../constants';
import { ModalError } from './modal.error';

export class ModalNotFoundError extends ModalError {
  constructor(modalId: string) {
    super(`Modal with id "${modalId}" not found`, ERROR_CODES.MODAL_NOT_FOUND);
  }
}
