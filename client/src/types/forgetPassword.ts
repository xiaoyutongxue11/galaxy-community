/**
 * 接口参数类型定义
 */
// 顽疾密码接口参数类型
export interface IForgetPasswordRequest {
  username: string;
  phone: string;
  password: string;
}

export interface IForgetPasswordForm extends IForgetPasswordRequest {
  confirmPassword: string;
}
