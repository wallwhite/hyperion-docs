'use client';

import { useEffect, useState, useMemo, type FC, type PropsWithChildren } from 'react';
import { ModalStoreContext } from '../context';
import { modalStore } from '../store';
import type { ModalState } from '../types';
import { ModalRenderer } from './modal-renderer';

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [modals, setModals] = useState<ModalState[]>([]);

  const contextValue = useMemo(
    () => ({
      modals,
      subscribe: (callback: () => void) => modalStore.subscribe(callback),
    }),
    [modals],
  );

  useEffect(() => {
    const updateModals = () => {
      setModals(modalStore.getActiveModals());
    };

    updateModals();

    return modalStore.subscribe(updateModals);
  }, []);

  return (
    <ModalStoreContext.Provider value={contextValue}>
      {children}
      <ModalRenderer modals={modals} />
    </ModalStoreContext.Provider>
  );
};
