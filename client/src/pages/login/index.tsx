import { Button, Checkbox, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import styles from './index.module.less';
import Logo from '../../assets/img/star.png';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = values => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = errorInfo => {
  console.log('Failed:', errorInfo);
};

const Login = () => {
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
          onFinish={onFinish}
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
                <Checkbox>
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
