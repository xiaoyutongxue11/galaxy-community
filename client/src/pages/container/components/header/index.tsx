import Logo from '@/assets/img/star.png';
import styles from './index.module.less';
import { RightOutlined } from '@ant-design/icons';
const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.logo}>
        <img src={Logo} alt="logo" />
        <h4>Galaxy Community</h4>
      </div>
      <div className={styles.userInfo}>
        <img src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" alt="avatar" />
        <h4>xiaoyutongxue</h4>
        <RightOutlined />
      </div>
    </div>
  );
};

export default Header;
