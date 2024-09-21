import Request from '@/http/request';
import { IForgetPasswordRequest } from '@/types/forgetPassword';

export const forgetPasswordAPI = async (data: IForgetPasswordRequest) => {
  const res = await Request.post('/auth/forgetPassword', data);
  return res.data;
};
