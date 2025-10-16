/* eslint-disable @typescript-eslint/no-explicit-any -- Allowing any for modal  */
'use client';

import { useEffect, useRef, useState, useMemo, type ComponentType } from 'react';
import { modalStore } from '../store';
import type { ModalHandler, ModalState, InferComponentProps } from '../types';

export const useModal = <C extends ComponentType<any>>(Component: C): ModalHandler<InferComponentProps<C>> => {
  const modalIdRef = useRef<string | null>(null);
  const [state, setState] = useState<ModalState | null>(null);

  useEffect(() => {
    if (!modalIdRef.current) {
      modalIdRef.current = modalStore.register(Component);
    }

    return modalStore.subscribe((modalId, modalState) => {
      if (modalId === modalIdRef.current) {
        setState(modalState);
      }
    });
  }, [Component]);

  return useMemo<ModalHandler<InferComponentProps<C>>>(
    () => ({
      open: async (props) => {
        if (!modalIdRef.current) {
          throw new Error('Modal not initialized');
        }

        return modalStore.open(modalIdRef.current, props);
      },

      close: (result) => {
        if (!modalIdRef.current) {
          throw new Error('Modal not initialized');
        }
        modalStore.close(modalIdRef.current, result);
      },

      setIsOpen: (isOpen) => {
        if (!modalIdRef.current) {
          throw new Error('Modal not initialized');
        }
        modalStore.setIsOpen(modalIdRef.current, isOpen);
      },

      get isOpen() {
        return state?.isOpen ?? false;
      },

      get props() {
        return state?.props as InferComponentProps<C> | undefined;
      },
    }),
    [state],
  );
};
