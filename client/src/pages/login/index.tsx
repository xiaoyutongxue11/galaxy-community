import { Button, Checkbox, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import styles from './index.module.less';
import Logo from '../../assets/img/star.png';
import { generateRandomString, encrypt, decrypt } from '@/utils/encryption';
import { tokenStorage, userStorage } from '@/utils/storage';
import useShowMessage from '@/hooks/useShowMessage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const getUserInfo = async () => {
  const userInfo = localStorage.getItem('userInfo');
  const authToken = localStorage.getItem('authToken');
  if (userInfo && authToken) {
    const info = JSON.parse(await decrypt(userInfo));
    const token = await decrypt(authToken);
    return {
      info,
      token
    };
  }
  return null;
};
const Login = () => {
  const showMessage = useShowMessage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSubmit: FormProps<FieldType>['onFinish'] = async values => {
    const { username, password } = values;
    const res = await getUserInfo();
    if (res && res.info.username === username) {
      tokenStorage.setItem(res.token);
      userStorage.setItem(JSON.stringify(res.info));
      showMessage('success', '登录成功');
      navigate('/');
      return;
    } else {
      setLoading(true);
      try {
        const params = { username, password };
      } catch {}
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const handleRemember = () => {};
  return (
    <div className={styles.bgContainer}>
      <div className={styles.loginContainer}>
        <div className={styles.title}>
          <img src={Logo} alt="logo" />
          <h2>Galaxy Community</h2>
        </div>
        <Form
          name="basic"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: '请输入您的用户名' }]}
          >
            <Input
              maxLength={255}
              style={{ background: 'transparent' }}
              placeholder="请输入用户名"
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: '请输入您的密码' }]}
          >
            <Input.Password
              maxLength={255}
              style={{ background: 'transparent' }}
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item<FieldType>>
            <div className={styles.toRegister}>
              没有账号？<span className={styles.registerTitle}>去注册</span>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginBtn}>
              登录
            </Button>
          </Form.Item>
          <Form.Item<FieldType>>
            <div className={styles.loginTools}>
              <div>
                <Checkbox onChange={handleRemember}>
                  <span>记住密码</span>
                </Checkbox>
              </div>
              <div className={styles.rightTool}>忘记密码？</div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
