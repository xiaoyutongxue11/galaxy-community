import styles from './index.module.less';
import Header from './components/header';
import { Outlet } from 'react-router-dom';
import Menu from './components/menu';

const Container = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <Menu />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Container;
