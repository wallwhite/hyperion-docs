import { ERROR_CODES } from '../constants';
import { ModalError } from './modal.error';

export class InvalidComponentError extends ModalError {
  constructor(message: string) {
    super(message, ERROR_CODES.INVALID_COMPONENT);
  }
}
