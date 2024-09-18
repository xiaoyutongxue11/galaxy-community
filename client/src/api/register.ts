import { IRegisterRequest, IRegisterResponse } from '@/types/register';
import Request from '@/http/request';

export const registerAPI = async (data: IRegisterRequest) => {
  const res = await Request.post<IRegisterRequest, IRegisterResponse>('/auth/register', data);
  return res.data;
};
