import { ERROR_CODES } from '../constants';
import { ModalError } from './modal.error';

export class ModalMaxLimitReachedError extends ModalError {
  constructor(maxModals: number) {
    super(`Maximum number of modals (${maxModals}) reached`, ERROR_CODES.MAX_MODALS_REACHED);
  }
}
