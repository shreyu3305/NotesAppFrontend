import { makeAutoObservable } from 'mobx';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  createdAt: number;
}

export type ModalType = 'create' | 'edit' | null;

export class UiStore {
  toasts: Toast[] = [];
  modal: { type: ModalType; open: boolean } = { type: null, open: false };
  globalLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Show a toast notification
   */
  showToast(type: ToastType, title: string, message: string) {
    const toast: Toast = {
      id: Date.now().toString(),
      type,
      title,
      message,
      createdAt: Date.now(),
    };

    this.toasts.push(toast);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      this.removeToast(toast.id);
    }, 5000);
  }

  /**
   * Remove a toast by ID
   */
  removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  /**
   * Open a modal
   */
  openModal(type: ModalType) {
    this.modal = { type, open: true };
  }

  /**
   * Close the current modal
   */
  closeModal() {
    this.modal = { type: null, open: false };
  }

  /**
   * Set global loading state
   */
  setGlobalLoading(loading: boolean) {
    this.globalLoading = loading;
  }
}