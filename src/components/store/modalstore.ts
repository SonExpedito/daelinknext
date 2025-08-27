import { create } from "zustand";

type ModalType = "display" | "confirm";

interface UIState {
  modalOpen: boolean;
  modalMessage: string;
  modalType: ModalType;
  onConfirmCallback?: () => void;
  confirmText?: string;
  cancelText?: string;
  openModal: (message: string) => void; // modal simples
  openConfirmModal: (
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  modalOpen: false,
  modalMessage: "",
  modalType: "display",
  onConfirmCallback: undefined,
  confirmText: "Confirmar",
  cancelText: "Cancelar",

  openModal: (message) =>
    set({
      modalOpen: true,
      modalMessage: message,
      modalType: "display",
      onConfirmCallback: undefined,
    }),

  openConfirmModal: (message, onConfirm, confirmText = "Confirmar", cancelText = "Cancelar") =>
    set({
      modalOpen: true,
      modalMessage: message,
      modalType: "confirm",
      onConfirmCallback: onConfirm,
      confirmText,
      cancelText,
    }),

  closeModal: () => set({ modalOpen: false, modalMessage: "", onConfirmCallback: undefined }),
}));
