import { ILoginRequest, ILoginResponse } from 'types/login';
import Request from '@/http/request';

export const LoginAPI = async (data: ILoginRequest) => {
  const res = await Request.post<ILoginRequest, ILoginResponse>('/login', data);
  return res.data;
};
