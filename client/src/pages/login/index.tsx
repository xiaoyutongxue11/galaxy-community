import { Button, Checkbox, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import styles from './index.module.less';
import Logo from '../../assets/img/star.png';
import { generateRandomString, encrypt, decrypt } from '@/utils/encryption';
import { tokenStorage, userStorage } from '@/utils/storage';
import useShowMessage from '@/hooks/useShowMessage';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loginAPI } from '@/api/login';
import { ILoginRequest, IUserInfo } from 'types/login';
import { HttpStatus } from '@/http/constant';

// 记住密码（将用户信息和 token 加密存储在本地）
const rememberUser = async (info: IUserInfo, token: string) => {
  const encryptedUserInfo = await encrypt(JSON.stringify(info));
  const encryptedToken = await encrypt(token);
  if (encryptedUserInfo && encryptedToken) {
    localStorage.setItem('userInfo', encryptedUserInfo);
    localStorage.setItem('authToken', encryptedToken);
  }
};
// 获取本地存储的用户信息
const getUserInfo = async () => {
  const userInfo = localStorage.getItem('userInfo');
  const authToken = localStorage.getItem('authToken');
  if (userInfo && authToken) {
    const info = JSON.parse(await decrypt(userInfo));
    const token = await decrypt(authToken);
    return { info, token };
  }
  return null;
};
const Login = () => {
  const showMessage = useShowMessage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const [loginFormInstance] = Form.useForm<ILoginRequest>();

  const handleSubmit: FormProps<ILoginRequest>['onFinish'] = async (values: ILoginRequest) => {
    const { username, password } = values;
    const res = await getUserInfo();
    if (res && res.info.username === username) {
      // 在 sessionStorage 中再存储一遍用户信息
      // 原因：localStorage 中的数据是长期存储，而 sessionStorage 中的数据会在浏览器关闭后自动删除
      tokenStorage.setItem(res.token);
      userStorage.setItem(JSON.stringify(res.info));
      showMessage('success', '登录成功');
      navigate('/');
      return;
    } else {
      setIsLoading(true);
      try {
        const params = { username, password };
        const res = await loginAPI(params);
        if (res.code === HttpStatus.SUCCESS && res.data) {
          const { info, token } = res.data;
          showMessage('success', '登录成功');
          setIsLoading(false);
          tokenStorage.setItem(token);
          userStorage.setItem(JSON.stringify(info));
          if (isRemember) {
            // 在这里存储能保证用户名密码是正确的，如果在 handleRemember 调用的话，数据不一定是正确的
            rememberUser(info, token);
          }
          navigate('/');
        } else {
          showMessage('error', res.message);
          setIsLoading(false);
        }
      } catch {
        showMessage('error', '登录失败，请重试');
        setIsLoading(false);
      }
    }
  };

  const handleRemember = () => {
    const newIsRemember = !isRemember;
    setIsRemember(newIsRemember);
    localStorage.setItem('isRemember', JSON.stringify(newIsRemember));
    if (!newIsRemember) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('authToken');
    }
  };

  // 初始化时判断本地是否记住了密码，有则将信息填充到框中，同时将记住密码勾选上
  useEffect(() => {
    getUserInfo().then(res => {
      if (res) {
        loginFormInstance.setFieldsValue({
          username: res.info.username,
          password: generateRandomString()
        });
        setIsRemember(true);
      } else {
        setIsRemember(false);
      }
    });
  }, []);
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
          autoComplete="off"
        >
          <Form.Item name="username" rules={[{ required: true, message: '请输入您的用户名' }]}>
            <Input style={{ background: 'transparent' }} placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入您的密码' }]}>
            <Input.Password style={{ background: 'transparent' }} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <div className={styles.toRegister}>
              没有账号？
              <Link to="/register" className={styles.registerTitle}>
                去注册
              </Link>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginBtn}
              loading={isLoading}
            >
              登录
            </Button>
          </Form.Item>
          <Form.Item>
            <div className={styles.loginTools}>
              <div>
                <Checkbox onChange={handleRemember} checked={isRemember}>
                  <span>记住密码</span>
                </Checkbox>
              </div>
              <Link to="/forgetPassword" className={styles.rightTool}>
                忘记密码？
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
