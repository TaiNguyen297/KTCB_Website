import React, { createContext, useContext, useState } from "react";
import { ModalConfirm, ModalSuccess } from "./components";

export const MODAL_TYPES = {
  MODAL_SUCCESS: "MODAL_SUCCESS",
  MODAL_CONFIRM: "MODAL_CONFIRM",
};

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.MODAL_SUCCESS]: ModalSuccess,
  [MODAL_TYPES.MODAL_CONFIRM]: ModalConfirm,
};

type GlobalModalContext = {
  showModal: (modalType: string, modalProps?: any) => void;
  hideModal: () => void;
  store: any;
};

const initalState: GlobalModalContext = {
  showModal: () => {},
  hideModal: () => {},
  store: {},
};

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [store, setStore] = useState(initalState.store);
  const { modalType, modalProps } = store || {};

  const showModal = (modalType: string, modalProps: any = {}) => {
    setStore({
      ...store,
      modalType,
      modalProps,
    });
  };

  const hideModal = () => {
    setStore({
      ...store,
      modalType: undefined,
      modalProps: {},
    });
  };

  const renderComponent = () => {
    if (!modalType) {
      return null;
    }
    const ModalComponent = MODAL_COMPONENTS[modalType];

    if (!ModalComponent) {
      return null;
    }

    return <ModalComponent {...modalProps} />;
  };

  return (
    <GlobalModalContext.Provider value={{ store, showModal, hideModal }}>
      {renderComponent()}
      {children}
    </GlobalModalContext.Provider>
  );
};
