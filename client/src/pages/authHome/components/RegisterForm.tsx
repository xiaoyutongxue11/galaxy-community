import { Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import styles from './form.module.less';
import useShowMessage from '@/hooks/useShowMessage';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HttpStatus } from '@/http/constant';
import { IRegisterForm } from '@/types/register';
import { generateAvatarAPI } from '@/assets/images';
import { registerAPI } from '@/api/register';

const RegisterForm = () => {
  const showMessage = useShowMessage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit: FormProps<IRegisterForm>['onFinish'] = async (values: IRegisterForm) => {
    const { username, phone, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      showMessage('error', '两次密码不一致');
      return;
    }
    setIsLoading(true);
    try {
      const avatar = `${generateAvatarAPI}${username}`;
      const params = { username, password, phone, avatar };
      const res = await registerAPI(params);
      if (res.code === HttpStatus.SUCCESS && res.data) {
        showMessage('success', '注册成功');
        navigate('/login');
      } else {
        showMessage('error', res.message);
      }
    } catch {
      showMessage('error', '服务器错误，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form
      name="basic"
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Form.Item name="username" rules={[{ required: true, message: '请输入您的用户名' }]}>
        <Input style={{ background: 'transparent' }} placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        name="phone"
        rules={[
          { required: true, message: '请输入您的手机号' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号码' }
        ]}
      >
        <Input style={{ background: 'transparent' }} placeholder="请输入您的手机号" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入您的密码' }]}>
        <Input.Password style={{ background: 'transparent' }} placeholder="请输入密码" />
      </Form.Item>
      <Form.Item name="confirmPassword" rules={[{ required: true, message: '请再次输入您的密码' }]}>
        <Input.Password style={{ background: 'transparent' }} placeholder="请再次输入密码" />
      </Form.Item>
      <Form.Item>
        <div className={styles.toRegister}>
          已有账号？
          <Link to="/authHome/loginForm" className={styles.registerTitle}>
            去登录
          </Link>
        </div>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className={styles.loginBtn} loading={isLoading}>
          注册
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
