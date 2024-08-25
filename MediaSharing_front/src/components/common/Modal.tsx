import React, { ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const portalRoot = document.getElementById("portal-root");

  if (!portalRoot) {
    throw new Error("The portal root element is missing from the document");
  }

  return ReactDOM.createPortal(
    <div
      style={{
        position: "absolute",
        alignSelf: "center",
        justifySelf: "center",
        left: "35%",
        top: "25%",
        width: "30rem",
        height: "20vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>,
    portalRoot
  );
};

export default Modal;
