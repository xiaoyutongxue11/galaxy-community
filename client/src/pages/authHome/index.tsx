import styles from './index.module.less';
import Logo from '@/assets/img/star.png';
import { Outlet } from 'react-router-dom';
import BgContainer from '@/components/bgContainer';

const AuthHome = () => {
  return (
    <BgContainer>
      <div className={styles.loginContainer}>
        <div className={styles.title}>
          <img src={Logo} alt="logo" />
          <h2>Galaxy Community</h2>
        </div>
        <Outlet />
      </div>
    </BgContainer>
  );
};

export default AuthHome;
