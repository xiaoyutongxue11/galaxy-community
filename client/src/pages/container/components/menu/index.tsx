import { MenuIconList } from '@/assets/icons';
import styles from './index.module.less';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = useMemo(() => {
    if (location.pathname === '/') return '/chat';
    return location.pathname;
  }, [location]);
  const handleNavigate = (menuPath: string) => {
    navigate(menuPath);
  };
  return (
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
  );
};

export default Menu;
