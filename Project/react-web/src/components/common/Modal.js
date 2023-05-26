import Modal from "antd";

const StyledModal = ({ isOpen, handleClose, message }) => {
  return (
    <Modal title="Info" visible={isOpen} onCancel={handleClose} footer={null}>
      <p>{message}</p>
    </Modal>
  );
};

export default StyledModal;
