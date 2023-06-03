import { Modal } from "antd";

const StyledModal = ({ isOpen, handleClose, message, handleOk }) => {
  return (
    <Modal title="Info" visible={isOpen} onCancel={handleClose} onOk={handleOk}>
      <p>{message}</p>
    </Modal>
  );
};

export default StyledModal;
