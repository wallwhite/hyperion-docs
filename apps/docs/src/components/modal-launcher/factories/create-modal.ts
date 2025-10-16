import type { ComponentType } from 'react';
import { modalStore } from '../store';
import type { ModalHandler, InferComponentProps } from '../types';

export const createModal = <C extends ComponentType>(Component: C): ModalHandler<InferComponentProps<C>> => {
  const modalId = modalStore.register(Component);

  const handler: ModalHandler<InferComponentProps<C>> = {
    open: async (props) => {
      return modalStore.open(modalId, props);
    },

    close: (result) => {
      modalStore.close(modalId, result);
    },

    setIsOpen: (isOpen) => {
      modalStore.setIsOpen(modalId, isOpen);
    },

    get isOpen() {
      return modalStore.getModal(modalId)?.isOpen ?? false;
    },

    get props() {
      return modalStore.getModal(modalId)?.props as InferComponentProps<C> | undefined;
    },
  };

  return handler;
};
