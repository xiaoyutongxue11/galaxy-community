import Request from '@/http/request';

interface ILogoutRequest {
  username: string;
}

// 退出登录
export const handleLogout = async (data: ILogoutRequest) => {
  const res = await Request.post('/auth/logout', data);
  return res.data;
};
