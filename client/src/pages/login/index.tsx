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
					<h1>星河社区</h1>
				</div>
				<Form
					name="basic"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					style={{ maxWidth: 600 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item<FieldType>
						label="用户名"
						name="username"
						rules={[{ required: true, message: '请输入您的用户名' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item<FieldType>
						label="密码"
						name="password"
						rules={[{ required: true, message: '请输入您的密码' }]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item<FieldType>
						name="remember"
						valuePropName="checked"
						wrapperCol={{ offset: 8, span: 16 }}
					>
						<Checkbox>记住密码</Checkbox>
					</Form.Item>

					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit">
							登录
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default Login;
