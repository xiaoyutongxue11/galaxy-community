import styles from './index.module.less';
import Logo from '@/assets/img/star.png';
import { Outlet } from 'react-router-dom';
const AuthHome = () => {
  return (
    <div className={styles.bgContainer}>
      <div className={styles.loginContainer}>
        <div className={styles.title}>
          <img src={Logo} alt="logo" />
          <h2>Galaxy Community</h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthHome;
