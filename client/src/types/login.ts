/**
 * 接口参数类型定义
 */
// 登录接口参数类型
export interface ILoginRequest {
  username: string;
  password: string;
}

// 登录接口返回类型定义
export interface IUserInfo {
  id: number;
  avatar: string;
  username: string;
  name: string;
  phone: string;
  created_at: string;
  signature: string;
}

export interface ILoginResponse {
  token: string;
  info: IUserInfo;
}