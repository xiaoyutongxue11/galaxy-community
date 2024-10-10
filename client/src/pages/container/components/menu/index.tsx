import { MenuIconList } from '@/assets/icons';
import styles from './index.module.less';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
import LogoutModal from '../logoutModal';
import { LogoutModalRefType } from '@/types/logout';
const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoutModalRef = useRef<LogoutModalRefType>();

  const activePath = useMemo(() => {
    if (location.pathname === '/') return '/chat';
    return location.pathname;
  }, [location]);
  const handleNavigate = (menuPath: string) => {
    if (menuPath === '/logout') logoutModalRef.current?.showLogoutModal();
    else navigate(menuPath);
  };
  return (
    <>
      <div className={styles.menu}>
        <ul>
          {MenuIconList.map(item => {
            return (
              <li
                key={item.key}
                onClick={() => handleNavigate(item.to)}
                className={`${activePath === item.to ? styles.active : ''}`}
              >
                {item.icon}
              </li>
            );
          })}
        </ul>
      </div>
      <LogoutModal ref={logoutModalRef} />
    </>
  );
};

export default Menu;
