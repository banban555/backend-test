import React from "react";

import { Modal } from "antd";

const CustomModal = ({ isOpen, handleClose, message }) => {
  return (
    <Modal title="Error" open={isOpen} onCancel={handleClose} footer={null}>
      <p>{message}</p>
    </Modal>
  );
};

export default CustomModal;
