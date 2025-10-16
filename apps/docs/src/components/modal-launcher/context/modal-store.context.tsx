'use client';

import { createContext } from 'react';
import type { ModalState } from '../types';

export interface ModalStoreContextValue {
  modals: ModalState[];
  subscribe: (callback: () => void) => () => void;
}

export const ModalStoreContext = createContext<ModalStoreContextValue | null>(null);
