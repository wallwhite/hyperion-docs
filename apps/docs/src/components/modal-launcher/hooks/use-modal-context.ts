'use client';

import { useContext } from 'react';
import { ModalInstanceContext } from '../context';
import { ModalNotFoundError, ModalProviderNotFoundError } from '../errors';
import { modalStore } from '../store';
import type { ModalContextValue } from '../types';

export const useModalContext = <P = unknown, R = unknown>(): ModalContextValue<P, R> => {
  const modalId = useContext(ModalInstanceContext);

  if (!modalId) {
    throw new ModalProviderNotFoundError();
  }

  const modal = modalStore.getModal(modalId);

  if (!modal) {
    throw new ModalNotFoundError(modalId);
  }

  return {
    modalId,
    props: (modal.props as P) ?? ({} as P),
    close: (result?: R) => {
      modalStore.close(modalId, result);
    },
    setIsOpen: (isOpen) => {
      modalStore.setIsOpen(modalId, isOpen);
    },
  };
};
