import { LogoutOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons';

interface IMenuItem {
  icon: React.ReactNode;
  key: string;
  text: string;
  to: string;
}

export const MenuIconList: IMenuItem[] = [
  {
    icon: <MessageOutlined />,
    key: 'sub1',
    text: '聊天',
    to: '/chat'
  },
  {
    icon: <TeamOutlined />,
    key: 'sub2',
    text: '通讯录',
    to: '/contacts'
  },
  {
    icon: <LogoutOutlined />,
    key: 'sub3',
    text: '登出',
    to: '/logout'
  }
];
