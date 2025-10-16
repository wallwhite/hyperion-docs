'use client';

import { ModalInstanceContext } from '../context';
import type { ModalState } from '../types';

export interface ModalRendererProps {
  modals: ModalState[];
}

export const ModalRenderer = ({ modals }: ModalRendererProps) => {
  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((modal) => {
        const ModalComponent = modal.component;
        const modalProps = (modal.props ?? {}) as Record<string, unknown>;

        return (
          <ModalInstanceContext.Provider key={modal.id} value={modal.id}>
            <ModalComponent {...modalProps} />
          </ModalInstanceContext.Provider>
        );
      })}
    </>
  );
};
