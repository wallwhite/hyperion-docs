import type { ComponentType } from 'react';

export interface ModalState<P = unknown> {
  id: string;
  isOpen: boolean;
  callbacks: ModalCallbacks;
  metadata: ModalMetadata;
  component: ComponentType<P>;
  props?: P;
}

export interface ModalCallbacks {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  promise: Promise<unknown>;
}

export interface ModalMetadata {
  createdAt: number;
  updatedAt: number;
  stackIndex?: number;
  parentId?: string;
}

export interface ModalHandler<P = unknown, R = unknown> {
  open: (props?: P) => Promise<R>;
  close: (result?: R) => void;
  setIsOpen: (isOpen: boolean) => void;
  readonly isOpen: boolean;
  readonly props?: P;
}

export type ModalSubscriber = (modalId: string, state: ModalState) => void;

export type ModalEvent<P = unknown> =
  | { type: 'open'; modalId: string; props?: P }
  | { type: 'close'; modalId: string; result?: unknown }
  | { type: 'update'; modalId: string; props?: P };

export interface ModalContextValue<P = unknown, R = unknown> {
  props: P;
  close: (result?: R) => void;
  setIsOpen: (isOpen: boolean) => void;
  modalId: string;
}

export interface ModalRendererProps {
  modals: ModalState[];
}

export type ModalAdapter<T = unknown> = (handler: ModalHandler) => T;

export interface ModalStoreConfig {
  maxModals?: number;
  warnOnMultipleInstances?: boolean;
}

export type InferComponentProps<T> = T extends ComponentType<infer P> ? P : never;
export type InferModalResult<T> = T extends ModalHandler<unknown, infer R> ? R : unknown;
