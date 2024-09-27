import React from 'react';
import { Navigate } from 'react-router-dom';
import { tokenStorage } from '@/utils/storage';

interface IAuthRouteProps {
  element: React.ReactNode;
}

const AuthRoute = (props: IAuthRouteProps) => {
  const { element } = props;
  const authToken = tokenStorage.getItem();
  if (authToken) {
    return <>{element}</>;
  }
  return (
    <>
      <Navigate to="/login" />
    </>
  );
};

// 高阶组件HOC，用于给需要需要登录才能访问的页面添加路由
export const withAuthRoute = (Component: React.ElementType) => {
  const WrappedComponent = (props: any) => {
    return <AuthRoute element={<Component {...props} />} />;
  };
  return WrappedComponent;
};
  