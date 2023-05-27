import { Modal } from "antd";

const StyledModal = ({ isOpen, handleClose, message }) => {
  return (
    <Modal title="Info" open={isOpen} onCancel={handleClose}>
      <p>{message}</p>
    </Modal>
  );
};

export default StyledModal;
