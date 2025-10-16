/* eslint-disable no-undefined -- Allow to be able co clear */
'use client';

import { useEffect, useState } from 'react';
import { modalStore } from '../store';
import type { ModalState } from '../types';

export const useModalState = (modalId: string): ModalState | undefined => {
  const [state, setState] = useState<ModalState | undefined>(() => modalStore.getModal(modalId));

  useEffect(() => {
    setState(modalStore.getModal(modalId));

    return modalStore.subscribe((changedModalId, modalState) => {
      if (changedModalId === modalId || changedModalId === '__clear__') {
        setState(changedModalId === '__clear__' ? undefined : modalState);
      }
    });
  }, [modalId]);

  return state;
};
