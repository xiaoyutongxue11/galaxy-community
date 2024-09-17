import { ILoginRequest, ILoginResponse } from 'types/login';
import Request from '@/http/request';

export const loginAPI = async (data: ILoginRequest) => {
  const res = await Request.post<ILoginRequest, ILoginResponse>('/auth/login', data);
  return res.data;
};
