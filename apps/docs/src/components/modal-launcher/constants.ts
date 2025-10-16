export const DEFAULT_CONFIG = {
  maxModals: 10,
  warnOnMultipleInstances: true,
} as const;

export const MODAL_ID_PREFIX = 'modal_';

export const MODAL_ID_SYMBOL = Symbol('ModalId');

export const MODAL_EVENTS = {
  OPEN: 'open',
  CLOSE: 'close',
  UPDATE: 'update',
} as const;

export const ERROR_CODES = {
  MODAL_NOT_FOUND: 'MODAL_NOT_FOUND',
  INVALID_COMPONENT: 'INVALID_COMPONENT',
  MAX_MODALS_REACHED: 'MAX_MODALS_REACHED',
  PROVIDER_NOT_FOUND: 'PROVIDER_NOT_FOUND',
} as const;
