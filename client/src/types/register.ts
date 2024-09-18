/**
 * 接口参数类型定义
 */
// 注册接口参数类型
export interface IRegisterRequest {
  username: string;
  phone: string;
  password: string;
  avatar?: string;
}

// 注册表单的数据类型
export interface IRegisterForm extends IRegisterRequest {
  confirmPassword: string;
}

// 注册接口返回的 data 类型
export interface IRegisterResponse {
  token: string;
  info: {
    id: number;
    avatar: string;
    username: string;
    name: string;
    phone: string;
    created_at: string;
    signature: string;
  };
}
