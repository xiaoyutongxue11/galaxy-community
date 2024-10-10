import { Modal } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutModal = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useImperativeHandle 来定义父组件可以访问的子组件方法
  useImperativeHandle(ref, () => ({
    showLogoutModal: () => {
      setIsModalOpen(true);
    }
  }));
  const handleOk = () => {
    setIsModalOpen(false);
    navigate('/authHome/loginForm');
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={'确定'}
      cancelText={'取消'}
    >
      <p>确定退出登录吗？</p>
    </Modal>
  );
});

export default LogoutModal;
