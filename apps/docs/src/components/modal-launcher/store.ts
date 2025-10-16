/* eslint-disable @typescript-eslint/no-explicit-any -- Allowing any for modal  */
import type { ComponentType } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_CONFIG, MODAL_ID_PREFIX, MODAL_ID_SYMBOL } from './constants';
import { ModalNotFoundError, ModalMaxLimitReachedError } from './errors';
import type { ModalState, ModalSubscriber, ModalCallbacks, ModalStoreConfig, ModalMetadata } from './types';

class ModalStore {
  private static instance: ModalStore | null = null;

  private subscribers = new Set<ModalSubscriber>();
  private modals = new Map<string, ModalState>();
  private registry = new Map<string, ComponentType>();
  private modalCallbacks = new Map<string, ModalCallbacks>();
  private config: ModalStoreConfig;

  private constructor(config?: ModalStoreConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  static getInstance(config?: ModalStoreConfig): ModalStore {
    if (!ModalStore.instance) {
      ModalStore.instance = new ModalStore(config);
    } else if (config && ModalStore.instance.config.warnOnMultipleInstances) {
      console.warn('ModalStore: Instance already exists. Configuration will be ignored.');
    }

    return ModalStore.instance;
  }

  subscribe(subscriber: ModalSubscriber): () => void {
    this.subscribers.add(subscriber);

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  register(component: ComponentType<any>): string {
    const componentWithId = component as unknown as Record<symbol, string>;
    const existingId = componentWithId[MODAL_ID_SYMBOL] as string | undefined;

    if (existingId && this.registry.has(existingId)) {
      return existingId;
    }

    const modalId = `${MODAL_ID_PREFIX}${uuidv4()}`;

    componentWithId[MODAL_ID_SYMBOL] = modalId;

    this.registry.set(modalId, component);

    return modalId;
  }

  async open(modalId: string, props?: unknown): Promise<unknown> {
    const component = this.registry.get(modalId);

    if (!component) {
      throw new ModalNotFoundError(modalId);
    }

    if (this.modals.size >= (this.config.maxModals ?? DEFAULT_CONFIG.maxModals)) {
      throw new ModalMaxLimitReachedError(this.config.maxModals ?? DEFAULT_CONFIG.maxModals);
    }

    let callbacks = this.modalCallbacks.get(modalId);

    if (!callbacks || this.modals.get(modalId)?.isOpen) {
      let resolveFunc!: (value: unknown) => void;
      let rejectFunc!: (reason?: unknown) => void;

      const promise = new Promise((resolve, reject) => {
        resolveFunc = resolve as (value: unknown) => void;
        rejectFunc = reject;
      });

      callbacks = {
        resolve: resolveFunc,
        reject: rejectFunc,
        promise,
      };

      this.modalCallbacks.set(modalId, callbacks);
    }

    const metadata: ModalMetadata = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      stackIndex: this.modals.size,
    };

    const state: ModalState = {
      id: modalId,
      isOpen: true,
      callbacks,
      metadata,
      component: component as ComponentType<unknown>,
      props,
    };

    this.modals.set(modalId, state);
    this.publish(modalId);

    return callbacks.promise;
  }

  close(modalId: string, result?: unknown): void {
    const modal = this.modals.get(modalId);

    if (!modal?.isOpen) {
      console.warn(`ModalStore: Attempted to close non-existent or closed modal "${modalId}"`);

      return;
    }

    modal.callbacks.resolve(result);

    modal.isOpen = false;
    modal.metadata.updatedAt = Date.now();

    this.publish(modalId);
    this.modals.delete(modalId);
    this.modalCallbacks.delete(modalId);
  }

  setIsOpen(modalId: string, isOpen: boolean): void {
    const modal = this.modals.get(modalId);

    if (!modal) {
      throw new ModalNotFoundError(modalId);
    }

    modal.isOpen = isOpen;
    modal.metadata.updatedAt = Date.now();

    this.publish(modalId);
  }

  getModal(modalId: string): ModalState | undefined {
    return this.modals.get(modalId);
  }

  getActiveModals(): ModalState[] {
    return [...this.modals.values()]
      .filter((modal) => modal.isOpen)
      .sort((a, b) => (a.metadata.stackIndex ?? 0) - (b.metadata.stackIndex ?? 0));
  }

  updateProps(modalId: string, props: unknown): void {
    const modal = this.modals.get(modalId);

    if (!modal) {
      throw new ModalNotFoundError(modalId);
    }

    modal.props = props;
    modal.metadata.updatedAt = Date.now();

    this.publish(modalId);
  }

  clearAll(): void {
    this.modals.forEach((modal) => {
      if (modal.isOpen) {
        modal.callbacks.reject(new Error('All modals cleared'));
      }
    });

    this.modals.clear();
    this.modalCallbacks.clear();
    this.registry.clear();

    this.subscribers.forEach((subscriber) => {
      try {
        subscriber('__clear__', {} as ModalState);
      } catch (error) {
        console.error('ModalStore: Error in subscriber during clear', error);
      }
    });
  }

  private publish(modalId: string): void {
    const state = this.modals.get(modalId);

    if (!state) return;

    this.subscribers.forEach((subscriber) => {
      try {
        subscriber(modalId, state);
      } catch (error) {
        console.error('ModalStore: Error in subscriber', error);
      }
    });
  }
}

export const modalStore = ModalStore.getInstance();
