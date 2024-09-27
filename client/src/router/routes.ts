import AuthHome from '@/pages/authHome';
import LoginForm from '@/pages/authHome/components/LoginForm';
import RegisterForm from '@/pages/authHome/components/RegisterForm';
import ForgetPasswordForm from '@/pages/authHome/components/ForgetPasswordForm';
import { lazy } from 'react';
import Chat from '@/pages/container/components/chat';
import Contacts from '@/pages/container/components/contacts';
import Home from '@/pages/home';

export interface IRouter {
  name?: string;
  redirect?: string;
  path: string;
  children?: Array<IRouter>;
  component: React.ComponentType;
}

export const router: Array<IRouter> = [
  {
    path: '/authHome',
    component: AuthHome,
    children: [
      {
        path: '',
        component: LoginForm
      },
      {
        path: 'loginForm',
        component: LoginForm
      },
      {
        path: 'registerForm',
        component: RegisterForm
      },
      {
        path: 'forgetPasswordForm',
        component: ForgetPasswordForm
      }
    ]
  },
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        component: Chat
      },
      {
        path: 'chat',
        component: Chat
      },
      {
        path: 'contacts',
        component: Contacts
      }
    ]
  },
  {
    path: '*',
    component: lazy(() => import('@/pages/error/index'))
  }
];
